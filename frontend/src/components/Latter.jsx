import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const SponsorshipGabar = () => {
  const [gender, setGender] = useState("female"); // Default to
 const [formData, setFormData] = useState({
    damiinte: { fullName: "", idType: "", idNo: "" },
    laDamiinte: { fullName: "", idType: "", idNo: "" },
    year: '',
    university: '',
    embassy: '',
    Safaarad: '',
    bankName: 'Salaam Somali Bank',
    accountNo: '',
    Witnesses1: '',
    Witnesses2: ''
  });
  
  const [modal, setModal] = useState(null);
  const [mode, setMode] = useState("keydan");
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState({ damiinte: [], laDamiinte: [] });
  const [editIndex, setEditIndex] = useState(null);
  const [suggestions, setSuggestions] = useState([]); // Simplify suggestions
  const [existing, setExisting] = useState({ damiinte: false, laDamiinte: false });
  const [includeLaDamiinte, setIncludeLaDamiinte] = useState(false);

  const idTypes = ["Passport", "ID Card", "Sugnan", "Laysin"];
  const [showLetter, setShowLetter] = useState(false);
  const [showMessage, setShowMessage] = useState('');

  // Handle main form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle search for damiinte/laDamiinte
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Update the correct nested field based on modal type
    setFormData(prev => ({
      ...prev,
      [modal]: {
        ...prev[modal],
        fullName: value
      }
    }));

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
    setFormData(prev => ({
      ...prev,
      [modal]: {
        fullName: record.fullName,
        idType: record.idType,
        idNo: record.idNo,
      }
    }));
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if current modal data is complete
    const currentData = formData[modal];
    if (!currentData.fullName || !currentData.idType || !currentData.idNo) {
      alert("Fadlan buuxi xogta oo dhan!");
      return;
    }

    try {
      let newRecord = { ...currentData };

      // Cusub → u dir backend
      if (mode === "cusub") {
        const bodyData =
          modal === "damiinte"
            ? { damiinte: currentData }
            : { laDamiinte: currentData };

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
        newRecord = data.saved || currentData;
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

      // Reset modal-specific data
      setFormData(prev => ({
        ...prev,
        [modal]: { fullName: "", idType: "", idNo: "" }
      }));
      
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
    setMode("keydan");
    setFormData(prev => ({
      ...prev,
      [type]: { ...records[type][index] }
    }));
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

  // In your modal form, use the nested data:
  const currentModalData = modal ? formData[modal] : { fullName: "", idType: "", idNo: "" };



  // const generateLetter = () => {
  //   setShowLetter(true);
  // };

  const downloadWord = () => {
    // download as Word qari kaliya from ka markii la buuxiyo soo bandhig
    if (records.damiinte.length === 0 || records.laDamiinte.length === 0) {
      alert("Fadlan ku dar xogta Damiinte iyo La Damiinte ka hor intaadan soo dejisan!");
      return;
    }

   

    const content = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Sponsorship Letter</title>
  <style>
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 12pt;
      line-height: 1.2;
      margin: 0;
      padding: 0;
    }
    p {
      margin: 2pt 0;
    }
    .center {
      text-align: center;
      font-weight: bold;
      margin: 20px 0;
    }
    .left {
      text-align: left;
    }
    .right {
      text-align: right;
    }
    .bold {
      font-weight: bold;
      color: red;
    }
    .underline {
      text-decoration: underline;
    }
    .signature-section {
      text-align: center;
      margin-top: 6pt;
    }
    .signature-area {
      margin-bottom: 10pt;
    }
    .witness-table {
      width: 120%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    .witness-table td {
      padding: 5px 20px;
      vertical-align: top;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="center">TO: <span class="bold">${formData.embassy.toUpperCase()}</span> EMBASSY OF SOMALIA</div>
  <div class="center">SUBJECT: DECLARATION OF FINANCIAL GUARANTEE</div>

  <p>
    I, the undersigned <span class="bold">${records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].fullName : '____________'}</span>, 
    Somali citizen, holder of Somali <span class="bold">${records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].idType : '____________'}</span> No: <span class="bold">${records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].idNo : '____________'}</span>, 
    hereby declare that I fully guarantee the expenses regarding to the university costs of,
    <span class="bold">${records.laDamiinte.length > 0 ? records.laDamiinte[records.laDamiinte.length - 1].fullName : '____________'}</span>, 
    Somali citizen holder of Somali 
    <span class="bold">${records.laDamiinte.length > 0 ? records.laDamiinte[records.laDamiinte.length - 1].idType : '____________'}</span>,
     No: <span class="bold">${records.laDamiinte.length > 0 ? records.laDamiinte[records.laDamiinte.length - 1].idNo : '____________'}</span>.
  </p>
  <p>
    ${pronoun} is planning to go to <span class="bold">${formData.embassy}</span> 
    to pursue ${possessive} studies at <span class="bold">${formData.university}</span> 
    University in the <span class="bold">${formData.year}</span> academic year as an international student.
  </p>

  <p>
    I also guarantee all the matters concerning ${possessive} journey to <span class="bold">${formData.embassy}</span> 
    during ${possessive} stay and higher studies in the country. 
  </p>

  <p>
    I confirm my full financial responsibility for the above-mentioned student during the entire period of ${possessive} studies at <span class="bold">${formData.university}</span> 
  </p>

  <p> ${pronoun} applied and expecting visa from <span class="bold">${formData.embassy}</span> 
    Embassy of Mogadishu-Somalia and I fully understand that failure to fulfill this legal obligation could result in penalties of state laws. 
  </p>

  <p>
    I have a bank account at <span class="bold">${formData.bankName}</span> 
    with account No: <span class="bold">${formData.accountNo}</span>.
  </p>
  
  <!-- Signature Section -->
  <div class="signature-section">
    <div class="signature-area">
      <p class="bold underline">SPONSOR'S NAME AND SIGNATURE</p>
       <p class="bold">${records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].fullName.toUpperCase() : '____________'}<br>

      <br>
      <p>____________________________________</p>
      <br>
    </div>
    
    <div class="center">
      <p class="bold underline">WITNESSES</p>
    </div>
    
    <!-- Witnesses Table - Is garab dhig -->
    <table class="witness-table">
      <tr>
        <td>
          <p class="bold">${formData.Witnesses1.toUpperCase()}</p>
          <p>__________________________________</p>
        </td>
        <td>
          <p class="bold">${formData.Witnesses2.toUpperCase()}</p>
          <p>__________________________________</p>
        </td>
      </tr>
    </table>

    <p class="bold mt-6">NOTARIAL CLAUSE</p>
    
    <p class="left">
      <span class="bold">
        I, Dr. Mohamed Abdirahman Sheikh Mohamed,
      </span>
      do hereby certify that the foregoing signatures, as well as those
      preserved in the official register, are authentic and were affixed in 
      my presence. This certification is duly made in conformity with Islamic Sharia 
      and the laws of the Federal Republic of Somalia.
    </p>
    <p class="bold">Boqole Public Notary</p>
    <p class="bold">Dr. Mohamed Abdirahman Sheikh Mohamed</p>
  </div>

  <div class="center">
    <div>KU: SAFAARADDA DOWLADDA <span class="bold">${formData.Safaarad.toUpperCase()}</span> EE SOOMAALIYA</div>
    <div>UJEEDDO: DAMAANAD-QAAD</div>
  </div>

  <p>
    Aniga oo ah <span class="bold">${records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].fullName : '____________'}</span>, 
    muwaadin Soomaaliyeed, haysta <span class="bold">${records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].idType :'____________'}</span>
   lambarkiisu yahay <span class="bold">${records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].idNo : '____________'}</span>,
    waxaan halkaan ku caddeynayaa inaan si buuxda dammaanad ugu qaaday kharashaadka waxbarasho iyo kuwo kale ee khuseeya
   <span class="bold">${records.laDamiinte.length > 0 ? records.laDamiinte[records.laDamiinte.length - 1].fullName : '____________'}</span>, 
    muwaadin Soomaaliyeed ah, ${lahaansho_sheyal} 
        <span class="bold">${records.laDamiinte.length > 0 ? records.laDamiinte[records.laDamiinte.length - 1].idType : '____________'}</span>,

     lambarkiisu yahay  <span class="bold">${records.laDamiinte.length > 0 ? records.laDamiinte[records.laDamiinte.length - 1].idNo : '____________'}</span>.
  </p>

  <p>
    Waxa ${magacUyeel_1} ${shaqo} in ${magacUyeel_1} u ${safar} dalka <span class="bold">${formData.Safaarad}</span> 
    si ${magacUyeel_1} wax ugu ${bar} Jaamacadda <span class="bold">${formData.university}</span> 
    sannadka waxbarasho ee <span class="bold">${formData.year}</span> ${magacUyeel} oo ah ${arday} caalami ah. 
  </p>

  <p>
    Sidoo kale waxaan dammaanad qaadayaa dhammaan arrimaha ku saabsan ${safar1} dalka <span class="bold">${formData.Safaarad}</span>, 
    muddada ${magacUyeel_1} halkaas ${Jog} iyo dhammaan kharashka ${waxbarasho} sare ee dalkaas. 
  </p>

  <p>
    Waxaan halkan ku xaqiijinayaa in aan awood u 
    leeyahay in aan daboolo dhammaan kharashaadka 
    jaamacadda ee ku baxaya, sida hoyga, lacagaha waxbarashada iyo waxyaabaha kale. 
  </p>

  <p>Waxa ${magacUyeel_1} ${codsi} ${magacUyeel_1} ${sug} in fiisaha laga siiyo Safaaradda dowladda <span class="bold">${formData.Safaarad}</span> 
      ee Muqdisho–Soomaaliya, waxa aan si buuxda u fahamsanahay in haddii aanan gudan waajibaadkan sharci, in ay keeni karto ciqaabta uu sharciga dhigayo. 
  </p>

  <p>
    Waxaan xisaab bangi ku leeyahay <span class="bold">${formData.bankName}</span> 
    Akoonka lambarkiisu yahay <span class="bold">${formData.accountNo}</span>.
  </p>

  <!-- Signature Section -->
  <div class="signature-section">
    <div class="signature-area">
      <p class="bold underline">MAGACA IYO SAXIIXA DAMMAANAD-QAADAHA</p>
      <p class="bold">${records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].fullName.toUpperCase() : '____________'}<br>
      <p>____________________________________</p>
      <br><br>
    </div>
    
    <div class="center">
      <p class="bold underline">SAXIIXYADA MARKHAATIYAASHA</p>
    </div>
    
    <!-- Witnesses Table - Is garab dhig -->
    <table class="witness-table">
      <tr>
        <td>
          <p class="bold">${formData.Witnesses1.toUpperCase()}</p>
          <p>__________________________________</p>
        </td>
        <td>
          <p class="bold">${formData.Witnesses2.toUpperCase()}</p>
          <p>__________________________________</p>
        </td>
      </tr>
    </table>
  
    <p class="bold mt-6">SUGITAANKA NOOTAAYADA</p>
    <p class="left">
      Anigoo ah Dr. <span class="bold">Maxamed Cabdiraxmaan Sheekh Maxamed,</span>
      waxaan sugayaa in saxiixyada kor ku xusan iyo kuwa ku keydsan diiwaankuba ay yihiin 
      kuwii runta ahaa ee lagu saxiixay horteyda, waana sugitaan ansax ah, 
      oo waafaqsan Shareecada Islaamka iyo qaanuunka dalka Soomaaliya.
    </p>
    <p class="bold">NOOTAAYAHA</p>
    <p class="bold">Dr. Maxamed Cabdiraxmaan Sheekh Maxamed</p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([content], { 
      type: "application/msword" 
    });
    
    saveAs(blob, "Sponsorship_Letter.doc");
    showNotification("File-ka waa la soo dejisay!");
  };

  const showNotification = (message) => {
    setShowMessage(message);
    setTimeout(() => {
      setShowMessage('');
    }, 3000);
  };
  // sentence chance female to male based on "she and her" if male
 const pronoun = gender === "female" ? "She" : "He";
const possessive = gender === "female" ? "her" : "his";


const magacUyeel_1 = gender === "female" ? "ay" : "uu";
const lahaansho_sheyal = gender === "female" ? "haysatana" : "haystana";
const magacUyeel = gender === "female" ? "ayada" : "isaga";
const lahaansho = gender === "female" ? "keeda" : "kiisa"; 
const shaqo = gender === "female" ? "qorsheyneysaa" : "qorsheynaya";
const safar = gender === "female" ? "safarto" : "safro";
const safar1 = gender === "female" ? "safarkeeda" : "safarkiisa";
const bar = gender === "female" ? "barato" : "barto";
const arday = gender === "female" ? "ardayad" : "arday";
const Jog = gender === "female" ? "joogeyso" : "joogayo";
const codsi = gender === "female" ? "codsatay" : "codsaday";
const sug = gender === "female" ? "sugeysaa" : "sugayaa";
const waxbarasho = gender === "female" ? "waxbarashadeeda" : "waxbarashadiisa";




  return (
    <div className="bg-gray-100 flex">
      {/* Sidebar */}
      
      <div className="flex-1 p-10 ml-64">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Sponsorship Letter Form Gabar</h1>
          
       

          {/* Modal */}
          {modal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                  onClick={() => {
                    setModal(null);
                    setEditIndex(null);
                    setFormData(prev => ({
                      ...prev,
                      [modal]: { fullName: "", idType: "", idNo: "" }
                    }));
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
                      value={currentModalData.fullName}
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
                    value={currentModalData.idType}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        [modal]: {
                          ...prev[modal],
                          idType: e.target.value
                        }
                      }))
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
                    value={currentModalData.idNo}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        [modal]: {
                          ...prev[modal],
                          idNo: e.target.value
                        }
                      }))
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

          {/* Rest of your component remains the same */}
          {/* ... */}
        

     {/* Table Section */}
<div className="mt-10">
  {["damiinte", "laDamiinte"].map((type) => (
    <div key={type} className="mb-8">
      <h3 className="text-lg font-bold capitalize mb-2">
        {type === "damiinte" ? "Damiinte" : "La Damiinte"}
      </h3>
      
      {records[type].length === 0 ? (
        <div className="text-center p-4 border border-dashed border-gray-300 rounded">
          <p className="text-gray-500 mb-4">Noting</p>
          <button
            onClick={() => setModal(type)}
            className={`px-4 py-2 rounded text-white ${
              type === "damiinte" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Ku dar {type === "damiinte" ? "Damiinte" : "La Damiinte"}
          </button>
        </div>
      ) : (
        <>
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
          
          {/* Add button below the table */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setModal(type)}
              className={`px-4 py-2 rounded text-white ${
                type === "damiinte" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Ku dar {type === "damiinte" ? "Damiinte" : "La Damiinte"} Cusub
            </button>
          </div>
        </>
      )}
    </div>
  ))}
</div>
 <select 
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="bg-gray-200 p-2 rounded mb-4"
        >
          <option value="female">Female (Gabar)</option>
          <option value="male">Male (Wiil)</option>
        </select>
   
           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* GENDER SELECTOR */}
      
       
     

            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              placeholder="Academic Year (e.g. 2025-2026)"
              className="border p-2 rounded"
              required
            />
            
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleInputChange}
              placeholder="University Name"
              className="border p-2 rounded"
              required
            />
            
            <input
              type="text"
              name="embassy"
              value={formData.embassy}
              onChange={handleInputChange}
              placeholder="Italy"
              className="border p-2 rounded"
              required
            />
            
            <input
              type="text"
              name="Safaarad"
              value={formData.Safaarad}
              onChange={handleInputChange}
              placeholder="Talyaaniga"
              className="border p-2 rounded"
              required
            />

            <select
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            >
              <option value="Salaam Somali Bank">Salaam Somali Bank</option>
              <option value="Dahabshiil Bank">Dahabshiil Bank</option>
              <option value="Premier Bank">Premier Bank</option>
              <option value="Agro Bank (Bankiga Beeraha)">Agro Bank (Bankiga Beeraha)</option>
            </select>

            <input
              type="text"
              name="accountNo"
              value={formData.accountNo}
              onChange={handleInputChange}
              placeholder="Bank Account Number"
              className="border p-2 rounded"
              required
            />
            
            
            
            <input
              type="text"
              name="Witnesses1"
              value={formData.Witnesses1}
              onChange={handleInputChange}
              placeholder="Markhaatiga 1aad"
              className="border p-2 rounded"
              required
            />
            
            <input
              type="text"
              name="Witnesses2"
              value={formData.Witnesses2}
              onChange={handleInputChange}
              placeholder="Markhaatiga 2aad"
              className="border p-2 rounded"
              required
            />
          </form>

          {/* BUTTONS */}
          <div className="text-center space-x-4">
            {/* <button
              type="button"
              onClick={generateLetter}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate Letter
            </button> */}
          
             
            <button
              type="button"
              onClick={downloadWord}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Download as Word
            </button>
          </div>

         {/* LETTER PREVIEW - Using the last added person */}
<div id="letter" className={`mt-10 bg-gray-50 p-6 rounded-lg border ${showLetter ? '' : 'hidden'}`}>
  <h2 className="text-lg font-bold text-center">TO: <span className="text-red-600 font-semibold">{formData.embassy}</span> EMBASSY OF SOMALIA</h2>
  <h3 className="text-center mb-4 font-semibold">SUBJECT: SPONSORSHIP LETTER</h3>

  <p>
    I, the undersigned 
    <span className="text-red-600 font-semibold"> 
      {records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].fullName : "______"}
    </span>, 
    Somali citizen, holder of Somali 
    <span className="text-red-600 font-semibold"> 
      {records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].idType : "______"}
    </span>, 
    No:
    <span className="text-red-600 font-semibold"> 
      {records.damiinte.length > 0 ? records.damiinte[records.damiinte.length - 1].idNo : "______"}
    </span>, 
    hereby declare that I fully guarantee the expenses regarding to the university costs of,
    <span className="text-red-600 font-semibold"> 
      {records.laDamiinte.length > 0 ? records.laDamiinte[records.laDamiinte.length - 1].fullName : "______"}
    </span>, 
    Somali citizen holder of Somali 
    <span className="text-red-600 font-semibold"> 
      {records.laDamiinte.length > 0 ? records.laDamiinte[records.laDamiinte.length - 1].idType : "______"}
    </span>, 
    No: 
    <span className="text-red-600 font-semibold"> 
      {records.laDamiinte.length > 0 ? records.laDamiinte[records.laDamiinte.length - 1].idNo : "______"}
    </span>.
  </p>
  <br />
            
            <p>
              I also guarantee all the matters concerning her journey to
              <span className="text-red-600 font-semibold"> {formData.embassy}</span>
              during her stay and higher studies in the country. 
            </p><br />

            <p>       
              I hereby confirm that I can afford all the costs to cover her university expenses like accommodations, tuition fees and others. 
            </p><br />
            
            <p>
              She applied and expecting visa from 
              <span className="text-red-600 font-semibold"> {formData.embassy}</span>
              Embassy of Mogadishu-Somalia and I fully understand that failure to fulfill this legal obligation could result in penalties of state laws.
            </p><br />

            <p>
              I have a bank account at 
              <span className="text-red-600 font-semibold"> {formData.bankName}</span> 
              with account No: 
              <span className="text-red-600 font-semibold"> {formData.accountNo}</span>.
            </p><br />
            
            <hr className="my-6" />

            {/* Somali */}
            <h2 className="text-lg font-bold text-center">KU: SAFAARADDA DOWLADDA <span className="text-red-600 font-semibold">{formData.Safaarad}</span> EE SOOMAALIYA</h2>
            <h3 className="text-center mb-4 font-semibold">UJEEDDO: DAMAANAD-QAAD</h3>

            <p>
              Aniga, hoos ku saxiixan 
              <span className="text-red-600 font-semibold"> {formData.damiinte.fullName}</span>, 
              muwaadin Soomaaliyeed, haysta 
              <span className="text-red-600 font-semibold"> {formData.damiinte.idType}</span>, 
              lambarkiisu yahay 
              <span className="text-red-600 font-semibold"> {formData.damiinte.idNo}</span>, 
              waxaan halkaan ku caddeynayaa inaan si buuxda dammaanad ugu qaaday kharashaadka waxbarasho iyo kuwo kale ee khuseeya 
              <span className="text-red-600 font-semibold"> {formData.laDamiinte.fullName}</span>, 
              muwaadin Soomaaliyeed ah, haysatana 
              <span className="text-red-600 font-semibold"> {formData.laDamiinte.idType}</span>,
               Soomaaliyeed lambarkiisu yahay 
              <span className="text-red-600 font-semibold"> {formData.laDamiinte.idNo}</span>.
            </p><br />

            <p>
              Waxa ay qorsheynaysaa in ay u safarto dalka 
              <span className="text-red-600 font-semibold"> {formData.Safaarad}</span>
              si ay wax ugu barto Jaamacadda 
              <span className="text-red-600 font-semibold"> {formData.university}</span> 
              sannadka waxbarasho ee 
              <span className="text-red-600 font-semibold"> {formData.year}</span> 
              Ayada oo ah arday caalami ah. 
            </p><br />
            
            <p>
              Sidoo kale waxaan dammaanad qaadayaa dhammaan arrimaha ku saabsan safarkeeda dalka
              <span className="text-red-600 font-semibold"> {formData.Safaarad}</span>, 
              muddada ay halkaas joogto iyo dhammaan kharashka waxbarashadeeda sare ee dalkaas. 
            </p><br />

            <p>
              Waxaan halkan ku xaqiijinayaa in aan awood u leeyahay in aan 
              daboolo dhammaan kharashaadka jaamacadda ee ku baxaya, 
              sida hoyga, lacagaha waxbarashada iyo waxyaabaha kale.      
            </p><br />
            
            <p>
              Waxa ay codsatay uuna sugeysaa in fiisaha laga siiyo Safaaradda dowladda
              <span className="text-red-600 font-semibold"> {formData.Safaarad}</span>
              ee Muqdisho–Soomaaliya, waxa aan si buuxda u fahamsanahay in haddii
              aanan gudan waajibaadkan sharci, in ay keeni karto ciqaab uu sharciga dhigayo.
            </p><br />
            
            <p>
              Waxaan xisaab bangi ku leeyahay 
              <span className="text-red-600 font-semibold"> {formData.bankName}</span> 
              lambarkiisuna yahay 
              <span className="text-red-600 font-semibold"> {formData.accountNo}</span>.
            </p><br />
            
            <hr className="my-6" />
            
            {/* Signature Section */}
            <div className="text-center mt-6">
              <div className="mb-6">
                <p className="font-bold underline">MAGACA IYO SAXIIXA DAMMAANAD-QAADAHA</p>
                <p className="font-bold">{formData.damiinte.fullName}</p>
                <br />
                <p>____________________________________</p>
                <br /><br />
              </div>
              
              <div className="text-center">
                <p className="font-bold underline">SAXIIXYADA MARQAATIYAASHA</p>
              </div>
              
              {/* Witnesses Table - Is garab dhig */}
              <table className="witness-table">
                <tr>
                  <td>
                    <p className="font-bold">{formData.Witnesses1}</p>
                    <p>__________________________________</p>
                  </td>
                  <td>
                    <p className="font-bold">{formData.Witnesses2}</p>
                    <p>__________________________________</p>
                  </td>
                </tr>
              </table>
              
              <span className="text-blue-800">
                <p className="font-bold mt-6">NOTARIAL CLAUSE</p>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Message */}
      {showMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {showMessage}
        </div>
      )}
    </div>
  );
};

export default SponsorshipGabar;