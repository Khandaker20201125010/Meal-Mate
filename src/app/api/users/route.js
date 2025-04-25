
import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Users from "@/src/models/Users";

// ? NEW CREATED USERS
export const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const exixst = await Users.findOne({ email: body.email });
    if (exixst) {
      return NextResponse.json(
        { message: "User Alredy Exixst" },
        { status: 409 }
      );
    }
    const newUser = new Users(body);
    const users = await newUser.save();
    return NextResponse.json(
      { message: "User Created", users },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Something went wrong", error: err.message },
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
