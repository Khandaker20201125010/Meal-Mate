import { NextResponse } from 'next/server';
import connectDB from '../../lib/connectDB';
import Payment from '@/src/models/Payment';


export async function POST(req) {
  const { email, transactionId, items, amount } = await req.json();
    
  try {
    await connectDB();
    const paymentDoc = await Payment.create({ email, transactionId, items, amount });
    return NextResponse.json({ success: true, payment: paymentDoc });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Saving payment failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
