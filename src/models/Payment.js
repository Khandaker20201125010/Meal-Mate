// models/Payment.js
import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  email:         { type: String, required: true },
  amount:        { type: Number, required: true }, 
  items: [{
    menuId:    String,
    title:     String,
    size:      String,
    quantity:  Number,
    unitPrice: Number
  }],
  transactionId: String,
  status:        { type: String, default: "Paid" },
  createdAt:     { type: Date,   default: Date.now }
});

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
