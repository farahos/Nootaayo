// // controllers/damiinController.js
// import Damiinte from "../models/Damiinte.js";
// import LaDamiinte from "../models/LaDamiinte.js";

// // Search by fullName
// export const searchDamiin = async (req, res) => {
//   try {
//     const { damiinteName, laDamiinteName } = req.query;

//     const damiinte = await Damiinte.findOne({ fullName: damiinteName });
//     const laDamiinte = await LaDamiinte.findOne({ fullName: laDamiinteName });

//     res.json({ damiinte, laDamiinte });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// // Suggest names (autocomplete)
// export const suggestNames = async (req, res) => {
//   try {
//     const { q, type } = req.query; // q = query string, type = damiinte | laDamiinte

//     let Model = type === "damiinte" ? Damiinte : LaDamiinte;

//     const results = await Model.find({ fullName: { $regex: q, $options: "i" } })
//       .limit(5); // 5 suggestion max

//     res.json(results);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// // Save both models at once (if not exist)
// export const createDamiin = async (req, res) => {
//   try {
//     const { damiinte, laDamiinte } = req.body;

//     // Check if exist
//     let existingDamiinte = await Damiinte.findOne({ fullName: damiinte.fullName });
//     let existingLaDamiinte = await LaDamiinte.findOne({ fullName: laDamiinte.fullName });

//     if (!existingDamiinte) {
//       existingDamiinte = await new Damiinte(damiinte).save();
//     }
//     if (!existingLaDamiinte) {
//       existingLaDamiinte = await new LaDamiinte(laDamiinte).save();
//     }

//     res.status(201).json({ message: "Damiinte iyo LaDamiinte waa la keydiyey", existingDamiinte, existingLaDamiinte });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
