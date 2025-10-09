import React, { useState } from "react";

export default function DamiinForm() {
  const [modal, setModal] = useState(null); // 'damiinte' ama 'laDamiinte'
  const [mode, setMode] = useState("keydan"); // 'keydan' ama 'cusub'
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [formData, setFormData] = useState({ fullName: "", idType: "", idNo: "" });
  const [records, setRecords] = useState({ damiinte: [], laDamiinte: [] });
  const [editIndex, setEditIndex] = useState(null); // index for editing

  const idTypes = ["Passport", "ID Card", "Sugnan", "Laysin"];

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFormData((prev) => ({ ...prev, fullName: value }));

    if (mode === "keydan" && value.length >= 2) {
      try {
        const res = await fetch(`/api/damiin/search-names?query=${value}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (record) => {
    setFormData({
      fullName: record.fullName,
      idType: record.idType,
      idNo: record.idNo,
    });
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.idType || !formData.idNo) {
      alert("Fadlan buuxi xogta oo dhan!");
      return;
    }

    try {
      let newRecord = { ...formData };

      // Cusub → u dir backend
      if (mode === "cusub") {
        const bodyData =
          modal === "damiinte"
            ? { damiinte: formData }
            : { laDamiinte: formData };

        const res = await fetch("/api/damiin/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Error saving record!");
          return;
        }

        alert("Xogta waa la keydiyey!");
        newRecord = data.saved || formData;
      }

      setRecords((prev) => {
        const updated = [...prev[modal]];
        if (editIndex !== null) {
          updated[editIndex] = newRecord;
        } else {
          updated.push(newRecord);
        }
        return { ...prev, [modal]: updated };
      });

      setFormData({ fullName: "", idType: "", idNo: "" });
      setSearchQuery("");
      setMode("keydan");
      setModal(null);
      setEditIndex(null);
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  const handleEdit = (type, index) => {
    setModal(type);
    setMode("keydan"); // mode keydan/edit
    setFormData({ ...records[type][index] });
    setEditIndex(index);
  };

  const handleDelete = (type, index) => {
    if (window.confirm("Ma hubtaa in aad tirtireyso?")) {
      setRecords((prev) => {
        const updated = [...prev[type]];
        updated.splice(index, 1);
        return { ...prev, [type]: updated };
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4 text-center">Foomka Damiin</h1>

      {/* Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setModal("damiinte")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ku dar Damiinte
        </button>
        <button
          onClick={() => setModal("laDamiinte")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ku dar La Damiinte
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
              onClick={() => {
                setModal(null);
                setEditIndex(null);
                setFormData({ fullName: "", idType: "", idNo: "" });
              }}
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-4 capitalize">
              {modal === "damiinte" ? "Ku dar Damiinte" : "Ku dar La Damiinte"}
            </h2>

            {/* Mode Dropdown */}
            <label className="block mb-2 font-medium">Xaaladda</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border p-2 w-full mb-4"
            >
              <option value="keydan">Keydan</option>
              <option value="cusub">Cusub</option>
            </select>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3 relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleSearch}
                  placeholder="Full Name"
                  className="border p-2 w-full"
                />
                {mode === "keydan" && suggestions.length > 0 && (
                  <ul className="absolute bg-white border w-full z-10 max-h-40 overflow-y-auto">
                    {suggestions.map((s) => (
                      <li
                        key={s._id}
                        onClick={() => handleSelect(s)}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {s.fullName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <select
                name="idType"
                value={formData.idType}
                onChange={(e) =>
                  setFormData({ ...formData, idType: e.target.value })
                }
                className="border p-2 w-full mb-3"
              >
                <option value="">Select ID Type</option>
                {idTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="idNo"
                placeholder="ID Number"
                value={formData.idNo}
                onChange={(e) =>
                  setFormData({ ...formData, idNo: e.target.value })
                }
                className="border p-2 w-full mb-4"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              >
                {editIndex !== null ? "Update Record" : mode === "cusub" ? "Save to Database" : "Add to List"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="mt-10">
        {["damiinte", "laDamiinte"].map((type) => (
          <div key={type} className="mb-8">
            <h3 className="text-lg font-bold capitalize mb-2">
              {type === "damiinte" ? "Damiinte" : "La Damiinte"}
            </h3>
            {records[type].length === 0 ? (
              <p className="text-gray-500">Ma jiro xog weli.</p>
            ) : (
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border p-2">Full Name</th>
                    <th className="border p-2">ID Type</th>
                    <th className="border p-2">ID No</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records[type].map((r, i) => (
                    <tr key={i}>
                      <td className="border p-2">{r.fullName}</td>
                      <td className="border p-2">{r.idType}</td>
                      <td className="border p-2">{r.idNo}</td>
                      <td className="border p-2 space-x-2">
                        <button
                          className="bg-yellow-400 text-white px-2 py-1 rounded"
                          onClick={() => handleEdit(type, i)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(type, i)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
