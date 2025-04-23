import { NextResponse } from 'next/server';

import Cart from "@/src/models/Cart";
import Menu from "@/src/models/Menu";
import connectDB from '../../lib/connectDB';

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { menuId, quantity, size, price, userEmail, title, image } = body;

        console.log("Received data:", body);

        const menu = await Menu.findById(menuId);
        if (!menu) {
            return NextResponse.json({ error: 'Menu item not found.' }, { status: 404 });
        }

        if (menu.quantity < quantity) {
            return NextResponse.json({ error: 'Not enough stock available.' }, { status: 400 });
        }

        const cartItem = new Cart({
            userEmail,
            menuId,
            title,
            quantity,
            size,
            price,
            image,
        });
        await cartItem.save();

        await Menu.findByIdAndUpdate(menuId, {
            $inc: { quantity: -quantity },
        });

        return NextResponse.json(cartItem, { status: 201 });
    } catch (err) {
        console.error('Error adding to cart:', err);
        return NextResponse.json({ error: 'Failed to add to cart', message: err.message }, { status: 500 });
    }
}
export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");

        if (!userEmail) {
            return NextResponse.json({ error: "Missing userEmail parameter" }, { status: 400 });
        }

        const carts = await Cart.find({ userEmail }).sort({ createdAt: -1 });

        return NextResponse.json(carts);
    } catch (err) {
        console.error('Error fetching cart items:', err);
        return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
    }
}