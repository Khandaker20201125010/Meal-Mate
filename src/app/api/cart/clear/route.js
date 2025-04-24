import connectDB from "@/src/app/lib/connectDB";
import Cart from "@/src/models/Cart";
import Menu from "@/src/models/Menu";
import { NextResponse } from "next/server";
export async function DELETE(req) {
    await connectDB();
  
    try {
      const { email } = await req.json();
  
      if (!email) {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }
  
      // Find all cart items for this user
      const userCartItems = await Cart.find({ userEmail: email });
  
      // Restore quantities for all items in the cart
      const bulkOps = userCartItems.map(item => ({
        updateOne: {
          filter: { _id: item.menuId },
          update: { $inc: { quantity: item.quantity } }
        }
      }));
  
      if (bulkOps.length > 0) {
        await Menu.bulkWrite(bulkOps);
      }
  
      // Delete all cart items for this user
      const deleteResult = await Cart.deleteMany({ userEmail: email });
  
      return NextResponse.json({
        success: true,
        message: `Deleted ${deleteResult.deletedCount} cart items`,
        restoredItems: bulkOps.length
      });
    } catch (err) {
      console.error('Cart clearance error:', err);
      return NextResponse.json(
        { error: 'Failed to clear cart' },
        { status: 500 }
      );
    }
  }