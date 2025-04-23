import connectDB from "@/src/app/lib/connectDB";
import Cart from "@/src/models/Cart";

import Menu from "@/src/models/Menu";
import { NextResponse } from "next/server";

// ========== DELETE Cart ==========

export async function DELETE(req, { params }) {
    await connectDB();

    try {
        const { id } = params;

        const cartItem = await Cart.findById(id); 
        if (!cartItem) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
        }

        // Restore menu quantity
        await Menu.findByIdAndUpdate(cartItem.menuId, {
            $inc: { quantity: cartItem.quantity }
        });

        // Delete cart item
        await Cart.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Cart canceled and quantity restored.' });
    } catch (err) {
        console.error('DELETE error:', err);
        return NextResponse.json({ error: 'Failed to cancel Cart' }, { status: 500 });
    }
}

