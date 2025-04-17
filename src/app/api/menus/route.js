import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Menu from "@/src/models/Menu";
// **ABSOLUTE** import from the project root


export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newMenu = await Menu.create(body);
    return NextResponse.json(newMenu, { status: 201 });
  } catch (err) {
    console.error("API POST error:", err);
    return NextResponse.json({ error: "Failed to create menu" }, { status: 500 });
  }
}
