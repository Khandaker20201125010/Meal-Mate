import { NextResponse } from 'next/server';
import connectDB from '../../lib/connectDB';
import Payment from '@/src/models/Payment';


export async function POST(req) {
  const { email, transactionId, items, amount } = await req.json()

  try {
    await connectDB()
    const paymentDoc = await Payment.create({ email, transactionId, items, amount })
    return NextResponse.json({ success: true, payment: paymentDoc })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'Saving payment failed' },
      { status: 500 }
    )
  }
}

// In your payments route (app/api/payments/route.js)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit')) || 5;

  try {
      await connectDB();
      const payments = await Payment.find()
          .sort({ createdAt: -1 })
          .limit(limit);
      
      // Ensure unique payments
      const uniquePayments = payments.filter(
          (payment, index, self) => 
              index === self.findIndex((p) => (
                  p._id.toString() === payment._id.toString()
              ))
      );

      return NextResponse.json(uniquePayments);
  } catch (err) {
      return NextResponse.json(
          { error: 'Failed to fetch payments' },
          { status: 500 }
      );
  }
}