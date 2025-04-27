// components/Payments/SubscriptionCheckoutForm.js
'use client';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const SubscriptionCheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // 1. Create payment intent
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const { clientSecret } = await response.json();

      // 2. Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: session.user.email,
            },
          },
        }
      );

      if (stripeError) {
        throw stripeError;
      }

      // 3. Update user status to "pro"
      const updateResponse = await fetch('/api/update-user-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: session.user.email,
          status: 'pro' 
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update user status');
      }

      // 4. Refresh session to get updated status
      await fetch('/api/auth/session?update');
      
      // 5. Call success callback
      onSuccess();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded p-4">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }} 
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Upgrade to Pro ($9/month)'}
      </button>
    </form>
  );
};

export default SubscriptionCheckoutForm;