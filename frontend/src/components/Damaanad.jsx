import React, { useState } from 'react';
import { saveAs } from 'file-saver';

const SponsorshipGabar = () => {
  const [formData, setFormData] = useState({
    sponsorName: '',
    Idname: 'Passport',
    sponsorPassport: '',
    studentName: '',
    studentPassport: '',
    year: '',
    university: '',
    embassy: '',
    Safaarad: '',
    bankName: 'Salaam Somali Bank',
    accountNo: '',
    Witnesses1: '',
    Witnesses2: ''
  });

  const [showLetter, setShowLetter] = useState(false);
  const [showMessage, setShowMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateLetter = () => {
    setShowLetter(true);
  };

  const downloadWord = () => {
    if (!formData.sponsorName) {
      alert("Fadlan buuxi form-ka ka hor inta aadan download-garin");
      return;
    }

    if (!showLetter) {
      alert("Fadlan dhagsii 'Generate Letter' marka hore");
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
    I, the undersigned <span class="bold">${formData.sponsorName}</span>, 
    Somali citizen, holder of Somali <span class="bold">${formData.Idname}</span> No: <span class="bold">${formData.sponsorPassport}</span>, 
    hereby declare that I fully guarantee the expenses regarding to the university costs of,
    <span class="bold">${formData.studentName}</span>, 
    Somali citizen holder of Somali Passport No: <span class="bold">${formData.studentPassport}</span>.
  </p>

  <p>
    She is planning to go to <span class="bold">${formData.embassy}</span> 
    to pursue her studies at <span class="bold">${formData.university}</span> 
    University in the <span class="bold">${formData.year}</span> academic year as an international student.
  </p>

  <p>
    I also guarantee all the matters concerning her journey to <span class="bold">${formData.embassy}</span> 
    during her stay and higher studies in the country. 
  </p>

  <p>
    I confirm my full financial responsibility for the above-mentioned student during the entire period of her studies at <span class="bold">${formData.university}</span> 
  </p>

  <p> She applied and expecting visa from <span class="bold">${formData.embassy}</span> 
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
      <p class="bold">${formData.sponsorName.toUpperCase()}</p>
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
          <p class="bold">${formData.Witnesses1}</p>
          <p>__________________________________</p>
        </td>
        <td>
          <p class="bold">${formData.Witnesses2}</p>
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
    Aniga oo ah <span class="bold">${formData.sponsorName}</span>, 
    muwaadin Soomaaliyeed, haysta <span class="bold">${formData.Idname}</span> lambarkiisu yahay <span class="bold">${formData.sponsorPassport}</span>, 
    waxaan halkaan ku caddeynayaa inaan si buuxda dammaanad ugu qaaday kharashaadka waxbarasho iyo kuwo kale ee khuseeya
    <span class="bold">${formData.studentName}</span>, 
    muwaadin Soomaaliyeed ah, haysatana baasaboorka lambarkiisu yahay <span class="bold">${formData.studentPassport}</span>.
  </p>

  <p>
    Waxa ay qorsheyneysaa in ay u safarto dalka <span class="bold">${formData.Safaarad}</span> 
    si ay wax ugu barato Jaamacadda <span class="bold">${formData.university}</span> 
    sannadka waxbarasho ee <span class="bold">${formData.year}</span> Ayada oo ah ardayad caalami ah. 
  </p>

  <p>
    Sidoo kale waxaan dammaanad qaadayaa dhammaan arrimaha ku saabsan safarkeeda dalka <span class="bold">${formData.Safaarad}</span>, 
    muddada ay halkaas joogeyso iyo dhammaan kharashka waxbarashadeeda sare ee dalkaas. 
  </p>

  <p>
    Waxaan halkan ku xaqiijinayaa in aan awood u 
    leeyahay in aan daboolo dhammaan kharashaadka 
    jaamacadda ee ku baxaya, sida hoyga, lacagaha waxbarashada iyo waxyaabaha kale. 
  </p>

  <p>Waxa ay codsatay ayna sugeysaa in fiisaha laga siiyo Safaaradda dowladda <span class="bold">${formData.Safaarad}</span> 
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
      <p class="bold">${formData.sponsorName.toUpperCase()}</p>
      <br>
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
          <p class="bold">${formData.Witnesses1}</p>
          <p>__________________________________</p>
        </td>
        <td>
          <p class="bold">${formData.Witnesses2}</p>
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

  return (
    <div className="bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-blue-700 text-white flex flex-col p-5 shadow-lg fixed top-0 left-0">
        <h1 className="text-2xl font-bold mb-10">Boqole Notory</h1>
        <nav className="flex flex-col space-y-4">
          <a href="Isku_Xayire.html" className="hover:bg-blue-600 px-4 py-2 rounded-lg">Isku Xayire</a>
          <a href="Rag_Rag_kale_uXayirayo.html" className="hover:bg-blue-600 px-4 py-2 rounded-lg">Rag Rag kale u Xayirayo</a>
          <a href="Rag_Dumar_u_Xayirayo.html" className="hover:bg-blue-600 px-4 py-2 rounded-lg">Rag Dumar u Xayirayo</a>
          <a href="Aasid_Shirkad.html" className="hover:bg-blue-600 px-4 py-2 rounded-lg">Aas'aasid Shirkad Hal Qof</a>
          <a href="AasAsid_Shirkad_Dad_Badan.html" className="hover:bg-blue-600 px-4 py-2 rounded-lg">Aas'aasid Shirkad Dad Badan</a>
          <a href="Sponsorshipwiil.html" className="hover:bg-blue-600 px-4 py-2 rounded-lg">Sponsorship Wiil</a>
          <a href="Sponsorshipgabar.html" className="hover:bg-blue-600 bg-blue-600 px-4 py-2 rounded-lg">Sponsorship Gabar</a>
        </nav>
      </div>

      <div className="flex-1 p-10 ml-64">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Sponsorship Letter Form Gabar</h1>

          {/* FORM */}
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <input
              type="text"
              name="sponsorName"
              value={formData.sponsorName}
              onChange={handleInputChange}
              placeholder="Sponsor Full Name"
              className="border p-2 rounded"
              required
            />
            
            <select
              name="Idname"
              value={formData.Idname}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            >
              <option value="Passport">Passport</option>
              <option value="ID Card">ID Card</option>
              <option value="Sugnaan">Sugnaan</option>
              <option value="Laysin">Laysin</option>
            </select>
            
            <input
              type="text"
              name="sponsorPassport"
              value={formData.sponsorPassport}
              onChange={handleInputChange}
              placeholder="Sponsor Passport No."
              className="border p-2 rounded"
              required
            />
            
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              placeholder="Student Full Name"
              className="border p-2 rounded"
              required
            />
            
            <input
              type="text"
              name="studentPassport"
              value={formData.studentPassport}
              onChange={handleInputChange}
              placeholder="Student Passport No."
              className="border p-2 rounded"
              required
            />
            
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
            
            <div></div>
            
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
            <button
              type="button"
              onClick={generateLetter}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate Letter
            </button>
            <button
              type="button"
              onClick={downloadWord}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Download as Word
            </button>
          </div>

          {/* LETTER PREVIEW */}
          <div id="letter" className={`mt-10 bg-gray-50 p-6 rounded-lg border ${showLetter ? '' : 'hidden'}`}>
            {/* English */}
            <h2 className="text-lg font-bold text-center">TO: <span className="text-red-600 font-semibold">{formData.embassy.toUpperCase()}</span> EMBASSY OF SOMALIA</h2>
            <h3 className="text-center mb-4 font-semibold">SUBJECT: SPONSORSHIP LETTER</h3>

            <p>
              I, the undersigned 
              <span className="text-red-600 font-semibold"> {formData.sponsorName}</span>, 
              Somali citizen, holder of Somali 
              <span className="text-red-600 font-semibold"> {formData.Idname}</span>, 
              No:
              <span className="text-red-600 font-semibold"> {formData.sponsorPassport}</span>, 
              hereby declare that I fully guarantee the expenses regarding to the university costs of,
              <span className="text-red-600 font-semibold"> {formData.studentName}</span>, 
              Somali citizen holder of Somali Passport No: 
              <span className="text-red-600 font-semibold"> {formData.studentPassport}</span>.
            </p><br />

            <p>
              She is planning to go to
              <span className="text-red-600 font-semibold"> {formData.embassy}</span>
              for studying at 
              <span className="text-red-600 font-semibold"> {formData.university}</span> 
              in the 
              <span className="text-red-600 font-semibold"> {formData.year}</span> 
              academic year as an international student.
            </p><br />
            
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
            <h2 className="text-lg font-bold text-center">KU: SAFAARADDA DOWLADDA <span className="text-red-600 font-semibold">{formData.Safaarad.toUpperCase()}</span> EE SOOMAALIYA</h2>
            <h3 className="text-center mb-4 font-semibold">UJEEDDO: DAMAANAD-QAAD</h3>

            <p>
              Aniga, hoos ku saxiixan 
              <span className="text-red-600 font-semibold"> {formData.sponsorName}</span>, 
              muwaadin Soomaaliyeed, haysta 
              <span className="text-red-600 font-semibold"> {formData.Idname}</span>, 
              lambarkiisu yahay 
              <span className="text-red-600 font-semibold"> {formData.sponsorPassport}</span>, 
              waxaan halkaan ku caddeynayaa inaan si buuxda dammaanad ugu qaaday kharashaadka waxbarasho iyo kuwo kale ee khuseeya 
              <span className="text-red-600 font-semibold"> {formData.studentName}</span>, 
              muwaadin Soomaaliyeed ah, haysatana baasaboorka Soomaaliyeed lambarkiisu yahay 
              <span className="text-red-600 font-semibold"> {formData.studentPassport}</span>.
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
                <p className="font-bold">{formData.sponsorName.toUpperCase()}</p>
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