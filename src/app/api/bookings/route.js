// app/api/bookings/route.js



import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Booking from "@/src/models/Booking";
import Menu from "@/src/models/Menu";

// ========== CREATE BOOKING ==========
export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    console.log("🔍 [POST /api/bookings] Received body:", body);

    const { menuId, quantity, userEmail } = body;
    if (!menuId || !quantity || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields (menuId, quantity or userEmail)" },
        { status: 400 }
      );
    }

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }
    if (menu.quantity < quantity) {
      return NextResponse.json(
        { error: "Not enough stock for booking" },
        { status: 400 }
      );
    }

    // Force valid status (falls back to 'booked')
    const validStatuses = ["booked", "completed", "cancelled"];
    const status = validStatuses.includes(body.status) ? body.status : "booked";

    const newBooking = new Booking({ ...body, status });
    await newBooking.save();
    console.log("✅ [POST /api/bookings] Saved booking:", newBooking);
    
    // Decrement stock
    await Menu.findByIdAndUpdate(menuId, { $inc: { quantity: -quantity } });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (err) {
    console.error("❌ [POST /api/bookings] Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to book item" },
      { status: 500 }
    );
  }
}
// ========== GET BOOKINGS ==========
export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    const query = userEmail ? { userEmail } : {};
    const bookings = await Booking.find(query).sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (err) {
    console.error('GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// ========== DELETE BOOKING ==========
export async function DELETE(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    await Menu.findByIdAndUpdate(booking.menuId, {
      $inc: { quantity: booking.quantity }
    });

    await Booking.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Booking canceled and quantity restored.' });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
