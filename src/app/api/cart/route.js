import { NextResponse } from "next/server";
import connectDB from "../../lib/connectDB";
import Cart from "@/src/models/Cart";
import Menu from "@/src/models/Menu";


export async function GET(req) {
    await connectDB();
    try {
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");

        if (!userEmail) {
            return NextResponse.json(
                { error: "userEmail parameter is required" },
                { status: 400 }
            );
        }

        const carts = await Cart.find({ userEmail }).sort({ createdAt: -1 });
        return NextResponse.json(carts);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    await connectDB();
    try {
        const body = await req.json();

        // No need to check menu quantity here since it was already checked during booking
        const cartItem = await Cart.create({
            ...body,
            status: "processing" // Set initial status
        });

        return NextResponse.json(cartItem, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
export async function PATCH(req, { params }) {
    await connectDB();
    try {
        const { id } = params;
        const { status } = await req.json();

        const cart = await Cart.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!cart) {
            return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
        }

        return NextResponse.json(cart);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    await connectDB();
    try {
        const { id } = params;
        const cart = await Cart.findById(id);

        if (!cart) {
            return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
        }

        // Restore menu quantity
        await Menu.findByIdAndUpdate(cart.menuId, {
            $inc: { quantity: cart.quantity }
        });

        await Cart.findByIdAndDelete(id);
        return NextResponse.json({ message: "Cart item deleted" });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}