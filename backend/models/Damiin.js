// models/Damiin.js
import mongoose from "mongoose";

const damiinSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idType: { type: String, enum: ["Passport", "ID Card", "Sugnan", "Laysin"], required: true },
  idNo: { type: String, required: true , unique: true },
});

export default mongoose.model("Damiin", damiinSchema);
