// routes/damiinRoutes.js
import express from "express";
import Damiin from "../models/Damiin.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { damiinte, laDamiinte } = req.body;

    let savedRecords = [];

    if (damiinte && damiinte.fullName && damiinte.idType && damiinte.idNo) {
      const d1 = new Damiin(damiinte);
      await d1.save();
      savedRecords.push(d1);
    }

    if (laDamiinte && laDamiinte.fullName && laDamiinte.idType && laDamiinte.idNo) {
      const d2 = new Damiin(laDamiinte);
      await d2.save();
      savedRecords.push(d2);
    }

    if (savedRecords.length === 0) {
      return res.status(400).json({ error: "wax soo gali Emty waye " });
    }

    res.json({ message: `${savedRecords.length} Qof (s) Ayaa diwan galisay`, records: savedRecords });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "ID gan hore ayaa loo diwan galiyay" });
    }
    res.status(500).json({ error: err.message });
  }
});



// suggestion search (by query)
router.get("/search-names", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);

    const records = await Damiin.find(
      { fullName: { $regex: query, $options: "i" } },
      { fullName: 1, idType: 1, idNo: 1 }
    ).limit(10);

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
