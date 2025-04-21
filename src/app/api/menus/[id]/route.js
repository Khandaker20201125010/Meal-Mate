import connectDB from "@/src/app/lib/connectDB";
import Menu from "@/src/models/Menu";
import { NextResponse } from "next/server";

// GET /api/menus/[id]
export async function GET(request, { params }) {
  const { id } = params;

  await connectDB();

  try {
    const menu = await Menu.findById(id);
    if (!menu) {
      return NextResponse.json({ message: "Menu not found" }, { status: 404 });
    }
    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/menus/[id]
export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  await connectDB();

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      {
        title: body.title,
        desc: body.description,
        smallPrice: body.smallPrice,
        largePrice: body.largePrice,
        quantity: body.quantity,
        category: body.category,
        image: body.image,
      },
      { new: true }
    );

    if (!updatedMenu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json(
      { error: "Server error while updating menu" },
      { status: 500 }
    );
  }
}

// DELETE /api/menus/[id]
export async function DELETE(request, { params }) {
  const { id } = params;

  await connectDB();

  try {
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Menu item deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting menu:", error);
    return NextResponse.json({ message: "Menu server error" }, { status: 500 });
  }
}
