// app/api/update-user-status/route.js
import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Users from "@/src/models/Users";


export async function POST(req) {
  try {
    await connectDB();
    
    const { email, status } = await req.json();
    
    const updatedUser = await Users.findOneAndUpdate(
      { email },
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'User status updated successfully',
        user: updatedUser 
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error updating user status:', err);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update user status',
        error: err.message 
      },
      { status: 500 }
    );
  }
}