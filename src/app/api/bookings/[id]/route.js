import connectDB from "@/src/app/lib/connectDB";
import Booking from "@/src/models/Booking";
import Menu from "@/src/models/Menu";
import { NextResponse } from "next/server";

// ========== DELETE BOOKING ==========

export async function DELETE(req, { params }) {
    await connectDB();

    try {
        const { id } = params;

        const booking = await Booking.findById(id);
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Restore menu quantity
        await Menu.findByIdAndUpdate(booking.menuId, {
            $inc: { quantity: booking.quantity }
        });

        // Delete booking
        await Booking.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Booking canceled and quantity restored.' });
    } catch (err) {
        console.error('DELETE error:', err);
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
    }
}
