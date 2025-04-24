// components/Payments/Payment.js
'use client';
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Payment = ({ booked, onPaymentSuccess }) => {
  if (!booked) return <p className="text-red-500">No order found</p>;

  const { email, items, price: totalPrice } = booked;

  return (
    <div className="p-4">
      <p className="font-bold text-cyan-500 mb-2">
        Order Summary for: <span className="text-white">{email}</span>
      </p>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-sm">Title</th>
              <th className="px-3 py-2 text-left text-sm">Size</th>
              <th className="px-3 py-2 text-left text-sm">Price</th>
              <th className="px-3 py-2 text-left text-sm">Qty</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2 text-sm">{item.title}</td>
                <td className="px-3 py-2 text-sm">{item.size}</td>
                <td className="px-3 py-2 text-sm">${item.price.toFixed(2)}</td>
                <td className="px-3 py-2 text-sm">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4">
        Total: <span className="text-red-500">${totalPrice.toFixed(2)}</span>
      </h3>

      <Elements stripe={stripePromise}>
        <CheckoutForm
          price={totalPrice}
          email={email}
          items={items} 
          onSuccess={onPaymentSuccess}
        />
      </Elements>
    </div>
  );
};

export default Payment;
