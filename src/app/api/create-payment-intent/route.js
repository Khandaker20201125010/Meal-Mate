import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '../../lib/connectDB';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { price } = await req.json();

  try {
    await connectDB();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(price * 100),
      currency: 'usd',
      payment_method_types: ['card'],
    });
    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'PaymentIntent creation failed' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' }, 
    { status: 405 }
  );
}