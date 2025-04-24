import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Menu from "@/src/models/Menu";
import Payment from "@/src/models/Payment";
// **ABSOLUTE** import from the project root

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const popular = searchParams.get('popular');

    // Get category statistics from payments
    const categoryStats = await Payment.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "menus",
          localField: "items.menuId",
          foreignField: "_id",
          as: "menu"
        }
      },
      { $unwind: "$menu" },
      { $unwind: "$menu.category" },
      {
        $group: {
          _id: "$menu.category",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { 
            $sum: { 
              $multiply: [
                "$items.quantity",
                "$items.unitPrice"
              ]
            }
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // If popular=true, also get top menu items
    if (popular) {
      const popularMenus = await Menu.find({ totalOrders: { $gt: 0 } })
        .sort({ totalOrders: -1 })
        .limit(5);
      
      return NextResponse.json({
        categoryStats,
        popularMenus
      });
    }

    return NextResponse.json({ categoryStats });
  } catch (err) {
    console.error("API GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch menu stats", details: err.message }, 
      { status: 500 }
    );
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
