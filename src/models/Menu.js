import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  smallPrice: { type: Number, required: true },
  largePrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  category: {
    type: [String],
    default: [],
    
    enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Discount"], // Add your categories
    required: true,
    validate: {
      validator: function(categories) {
        return categories.length > 0; // Ensure at least one category
      },
      message: "At least one category is required"
    } 
  },
}, { timestamps: true }); 

export default mongoose.models.Menu || mongoose.model("Menu", menuSchema);