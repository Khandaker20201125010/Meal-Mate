import { NextResponse } from "next/server";

import { isValidObjectId } from "mongoose";
import connectDB from "@/src/app/lib/connectDB";
import Reservation from "@/src/models/Reservation";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid reservation ID format" },
        { status: 400 }
      );
    }

    const reservation = await Reservation.findById(id);
    
    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { reservation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch reservation" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { status } = await request.json();

    // Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid reservation ID format" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update reservation
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Status updated successfully", 
        reservation: updatedReservation 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: "Invalid reservation ID format" },
        { status: 400 }
      );
    }

    const deletedReservation = await Reservation.findByIdAndDelete(id);

    if (!deletedReservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Reservation deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete reservation" },
      { status: 500 }
    );
  }
}