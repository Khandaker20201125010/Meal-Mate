import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    menuId: { type: String, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
