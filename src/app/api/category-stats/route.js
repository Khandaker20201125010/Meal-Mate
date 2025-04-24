// app/api/category-stats/route.js
import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Payment from "@/src/models/Payment";


export async function GET() {
    try {
      await connectDB();
  
      // Get category statistics from payments
      const categoryStats = await Payment.aggregate([
        { $unwind: "$items" },
        {
          $lookup: {
            from: "menus",
            let: { menuId: { $toObjectId: "$items.menuId" } }, // Convert string to ObjectId
            pipeline: [
              { 
                $match: { 
                  $expr: { $eq: ["$_id", "$$menuId"] } 
                } 
              }
            ],
            as: "menu"
          }
        },
        { $unwind: "$menu" },
        { $unwind: "$menu.category" }, // Unwind the categories array
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
  
      console.log('Category stats:', categoryStats); // Debug log
  
      return NextResponse.json(categoryStats);
    } catch (err) {
      console.error("Category stats error:", err);
      return NextResponse.json(
        { error: "Failed to fetch category stats", details: err.message }, 
        { status: 500 }
      );
    }
  }