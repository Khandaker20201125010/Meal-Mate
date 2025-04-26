import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Reservation from "@/src/models/Reservation";

export async function POST(request) {
    try {
      await connectDB();
      
      const {
        name,
        phone,
        guests,
        date,
        time,
        specialRequests,
        userEmail,
        userName
      } = await request.json();
  
      // Validate required fields
      if (!name || !phone || !date || !time || !userEmail) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
  
      // Create and save new reservation
      const reservation = new Reservation({
        name,
        phone,
        guests,
        date: new Date(date),
        time,
        specialRequests,
        userEmail,
        userName,
        status: "pending"
      });
  
      await reservation.save();
  
      return NextResponse.json(
        { 
          message: "Reservation created successfully", 
          reservation 
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Reservation error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create reservation" },
        { status: 500 }
      );
    }
  }
  
  export async function GET(request) {
    try {
      await connectDB();
  
      // Get query parameters
      const { searchParams } = new URL(request.url);
      const userEmail = searchParams.get('userEmail');
      const status = searchParams.get('status');
      
      // Build query
      const query = {};
      if (userEmail) query.userEmail = userEmail;
      if (status) query.status = status;
  
      // Find and sort reservations
      const reservations = await Reservation.find(query)
        .sort({ date: -1, time: -1 });
  
      return NextResponse.json(
        { reservations },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch reservations" },
        { status: 500 }
      );
    }
  }