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
export async function PATCH(req, { params }) {
    await connectDB();

    try {
        const { id } = params;
        const { status } = await req.json();

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(booking);
    } catch (err) {
        console.error('PATCH error:', err);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}
export async function GET(req, { params }) {
    await connectDB();

    try {
        const { id } = params;
        const booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(booking);
    } catch (err) {
        console.error('GET error:', err);
        return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
    }
}