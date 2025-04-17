import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  desc:        { type: String, required: true },
  smallPrice:  { type: Number, required: true },
  largePrice:  { type: Number, required: true },
  image:       { type: String, required: true },
  category:    { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Menu || mongoose.model("Menu", menuSchema);
