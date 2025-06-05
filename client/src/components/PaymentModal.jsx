import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ clientSecret, onClose }) => {
  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;