import React, { useState } from "react";

export default function DamiinForm() {
  const [formData, setFormData] = useState({
    damiinte: { fullName: "", idType: "", idNo: "" },
    laDamiinte: { fullName: "", idType: "", idNo: "" },
  });

  const [suggestions, setSuggestions] = useState({ damiinte: [], laDamiinte: [] });
  const [existing, setExisting] = useState({ damiinte: false, laDamiinte: false });
  const [includeLaDamiinte, setIncludeLaDamiinte] = useState(false); // toggle for 2nd person
  const idTypes = ["Passport", "ID Card", "Sugnan", "Laysin"];

  const handleChange = async (e, type) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [type]: { ...formData[type], [e.target.name]: value },
    });

    // Search suggestion by name
    if (e.target.name === "fullName" && value.length >= 2) {
      const res = await fetch(`/api/damiin/search-names?query=${value}`);
      const data = await res.json();

      setSuggestions((prev) => ({ ...prev, [type]: data }));

      // haddii qof jira oo magaciisu ku jiro → calaamadee "existing"
      if (data.length > 0) {
        setExisting((prev) => ({ ...prev, [type]: true }));
      } else {
        setExisting((prev) => ({ ...prev, [type]: false }));
      }
    } else {
      setSuggestions((prev) => ({ ...prev, [type]: [] }));
      setExisting((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSelectSuggestion = (type, record) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        fullName: record.fullName,
        idType: record.idType,
        idNo: record.idNo,
      },
    }));
    setSuggestions((prev) => ({ ...prev, [type]: [] }));
    setExisting((prev) => ({ ...prev, [type]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { damiinte: formData.damiinte };
      if (includeLaDamiinte) {
        payload.laDamiinte = formData.laDamiinte;
      }

      const res = await fetch("/api/damiin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error saving record");
      } else {
        alert(data.message);
        setFormData({
          damiinte: { fullName: "", idType: "", idNo: "" },
          laDamiinte: { fullName: "", idType: "", idNo: "" },
        });
        setExisting({ damiinte: false, laDamiinte: false });
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-lg mx-auto">
      {/* Damiinte */}
      <div className="relative">
        <h2 className="text-lg font-bold">Damiinte</h2>
        <input
          name="fullName"
          placeholder="Full Name"
          value={formData.damiinte.fullName}
          onChange={(e) => handleChange(e, "damiinte")}
          className="border p-2 w-full"
        />
        {suggestions.damiinte.length > 0 && (
          <ul className="absolute bg-white border w-full z-10">
            {suggestions.damiinte.map((s) => (
              <li
                key={s._id}
                onClick={() => handleSelectSuggestion("damiinte", s)}
                className="p-2 hover:bg-gray-200 cursor-pointer"
              >
                {s.fullName}
              </li>
            ))}
          </ul>
        )}
        <select
          name="idType"
          value={formData.damiinte.idType}
          onChange={(e) => handleChange(e, "damiinte")}
          className="border p-2 w-full mt-2"
        >
          <option value="">Select ID Type</option>
          {idTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          name="idNo"
          placeholder="ID Number"
          value={formData.damiinte.idNo}
          onChange={(e) => handleChange(e, "damiinte")}
          className="border p-2 w-full mt-2"
        />
      </div>

      {/* Toggle for laDamiinte */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeLaDamiinte}
            onChange={(e) => setIncludeLaDamiinte(e.target.checked)}
          />
          <span>Add La Damiinte</span>
        </label>
      </div>

      {/* La Damiinte */}
      {includeLaDamiinte && (
        <div className="relative">
          <h2 className="text-lg font-bold">La Damiinte</h2>
          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.laDamiinte.fullName}
            onChange={(e) => handleChange(e, "laDamiinte")}
            className="border p-2 w-full"
          />
          {suggestions.laDamiinte.length > 0 && (
            <ul className="absolute bg-white border w-full z-10">
              {suggestions.laDamiinte.map((s) => (
                <li
                  key={s._id}
                  onClick={() => handleSelectSuggestion("laDamiinte", s)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {s.fullName}
                </li>
              ))}
            </ul>
          )}
          <select
            name="idType"
            value={formData.laDamiinte.idType}
            onChange={(e) => handleChange(e, "laDamiinte")}
            className="border p-2 w-full mt-2"
          >
            <option value="">Select ID Type</option>
            {idTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            name="idNo"
            placeholder="ID Number"
            value={formData.laDamiinte.idNo}
            onChange={(e) => handleChange(e, "laDamiinte")}
            className="border p-2 w-full mt-2"
          />
        </div>
      )}

      {/* Save button → wuxuu soo baxaa oo keliya haddii qof cusub yahay */}
      {(!existing.damiinte || (includeLaDamiinte && !existing.laDamiinte)) && (
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      )}
    </form>
  );
}
