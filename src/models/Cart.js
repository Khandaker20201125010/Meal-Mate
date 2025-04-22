import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);