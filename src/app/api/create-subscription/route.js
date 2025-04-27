import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 900, // $9.00 in cents
      currency: 'usd',
      metadata: { customer_email: email },
      description: 'MealMate Pro Subscription',
    });

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret },
      { status: 200 }
    );
  } catch (err) {
    console.error('Stripe error:', err);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to create subscription',
        error: err.message 
      },
      { status: 500 }
    );
  }
}