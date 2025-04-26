import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  specialRequests: { type: String },
  userEmail: { type: String, required: true },
  userName: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);
