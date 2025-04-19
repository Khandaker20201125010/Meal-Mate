import { NextResponse } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Users from "@/src/models/Users";

//? UPDATE USER ROLE
export const PUT = async (req, { params }) => {
  const { id } = params;
  const { role } = await req.json();

  try {
    await connectDB();
    const user = await Users.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User updated", user }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

