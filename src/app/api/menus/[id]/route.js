import connectDB from "@/src/app/lib/connectDB";
import Menu from "@/src/models/Menu";
import { NextResponse } from "next/server";
export async function PUT(request, { params }) {
  const { id } = params;
  const body = await request.json();

  await connectDB();

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      {
        title: body.title,
        smallPrice: body.smallPrice,
        largePrice: body.largePrice,
        category: body.category,
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
export const DELETE = async (req, { params }) => {
  const { id } = params;

  try {
    await connectDB(); // Make sure your database connection function is correct
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return NextResponse.json({ message: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Menu item deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE /api/menus/[id]:", error);
    return NextResponse.json(
      { message: "Menu server error" },
      { status: 500 }
    );
  }
};