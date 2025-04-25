import { NextResponse } from "next/server";
import connectDB from "@/src/app/lib/connectDB";
import Users from "@/src/models/Users";

//? UPDATE USER ROLE
export const PUT = async (req, { params }) => {
  const { id } = params;

  try {
    await connectDB();

    const contentType = req.headers.get("content-type");
    let updateData = {};

    // Handle both JSON and multipart/form-data
    if (contentType.includes("application/json")) {
      updateData = await req.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        updateData[key] = value;
      });
    }

    const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

