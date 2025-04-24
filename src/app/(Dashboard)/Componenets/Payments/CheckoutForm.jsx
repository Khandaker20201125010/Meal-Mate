// components/CheckoutForm.js
'use client';
import React, { useState, useEffect } from 'react';
import { CardNumberElement, CardCvcElement, CardExpiryElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ price, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState('');
  const [cardError, setCardError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (price) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price }),
      })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret));
    }
  }, [price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) return;

    const card = elements.getElement(CardNumberElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: 'Test User', // Replace with user info
          email: 'user@example.com',
        },
      },
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      setSuccess('Payment successful!');
      setTransactionId(paymentIntent.id);
      setProcessing(false);

      // Optional: save to your backend
      fetch('/api/save-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price,
          transactionId: paymentIntent.id,
          email: 'user@example.com',
        }),
      });

      onSuccess?.(); // optional callback
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Card Number</label>
        <div className="border rounded p-3">
          <CardNumberElement className="w-full" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Expiry</label>
        <div className="border rounded p-3">
          <CardExpiryElement />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">CVC</label>
        <div className="border rounded p-3">
          <CardCvcElement />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!stripe || !clientSecret || processing}
      >
        Pay ${price}
      </button>

      {cardError && <p className="text-red-500 mt-2">{cardError}</p>}
      {success && (
        <div className="text-green-600 mt-2">
          <p>{success}</p>
          <p>Transaction ID: <strong>{transactionId}</strong></p>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
