
import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Users from "@/src/models/Users";
import bcrypt from "bcryptjs";
// ? NEW CREATED USERS
export const POST = async (req) => {
  try {
    await connectDB();

    const body = await req.json();
    console.log("Request body:", body); // Debugging

    // Validate required fields
    if (!body.name || !body.email || !body.password || !body.image) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await Users.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create new user
    const newUser = new Users({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      image: body.image,
      role: "customer" // Changed from "tourist" to match your schema
    });

    const savedUser = await newUser.save();

    // Return user without password
    const { password, ...userWithoutPassword } = savedUser._doc;

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in user creation:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: err.message
      },
      { status: 500 }
    );
  }
};
// ? GET ALL USERS
export const GET = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (email) {
      const user = await Users.findOne({ email });
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
      return NextResponse.json(user, { status: 200 });
    }

    const users = await Users.find({});
    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong", error: err.message }, { status: 500 });
  }
};


// ? DELETE USER
export const DELETE = async (req) => {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    const deletedUser = await Users.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err.message },
      { status: 500 }
    );
  }
};
