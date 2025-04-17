import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Menu from "@/src/models/Menu";
// **ABSOLUTE** import from the project root

export async function GET(req) {
  try {
    await connectDB(); 
    const menus = await Menu.find(); 
    return NextResponse.json(menus, { status: 200 });
  } catch (err) {
    console.error("API GET error:", err);
    return NextResponse.json({ error: "Failed to fetch menus" }, { status: 500 });
  }
}

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
