// components/CheckoutForm.js
'use client';
import React, { useState, useEffect } from "react";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ price, email, items, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState("");
  const [cardError, setCardError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);
  const [txId, setTxId] = useState("");

  useEffect(() => {
    if (!price) return;
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price })
    })
      .then(r => r.json())
      .then(d => setClientSecret(d.clientSecret));
  }, [price]);

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessing(true);
    setCardError("");

    if (!stripe || !elements || !clientSecret) return;

    try {
      const card = elements.getElement(CardNumberElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { name: email.split("@")[0], email }
        }
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setSuccess("Payment successful!");
        setTxId(paymentIntent.id);

        // 1. Save payment record
        const paymentResponse = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            transactionId: paymentIntent.id,
            items: items.map(item => ({
              menuId: item.menuId,
              title: item.title,
              size: item.size,
              quantity: item.quantity,
              unitPrice: item.price,
            })),
            amount: price
          })
        });

        if (!paymentResponse.ok) {
          throw new Error('Payment recording failed');
        }

        // 2. Clear all cart items for this user
        const clearCartResponse = await fetch("/api/cart/clear", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        if (!clearCartResponse.ok) {
          throw new Error('Cart clearing failed');
        }

        // 3. Notify parent component
        onSuccess();
      }
    } catch (err) {
      console.error("Payment processing error:", err);
      setCardError(err.message || "Payment succeeded but there was an issue with order processing");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Card Number</label>
        <div className="border rounded p-2">
          <CardNumberElement />
        </div>
      </div>
      <div>
        <label className="block text-sm">Expiry</label>
        <div className="border rounded p-2">
          <CardExpiryElement />
        </div>
      </div>
      <div>
        <label className="block text-sm">CVC</label>
        <div className="border rounded p-2">
          <CardCvcElement />
        </div>
      </div>
      <button
        type="submit"
        className="btn bg-orange-600 text-white"
        disabled={!stripe || processing}
      >
        Pay ${price.toFixed(2)}
      </button>
      {cardError && <p className="text-red-500">{cardError}</p>}
      {success && (
        <p className="text-green-500">
          {success} (ID: <strong>{txId}</strong>)
        </p>
      )}
    </form>
  );
};

export default CheckoutForm;
