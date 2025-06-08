import React, { useContext, useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const StripeCardPayment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const { appointmentId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const fetchClientSecret = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-stripe`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        setClientSecret(data.clientSecret);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token && appointmentId) {
      fetchClientSecret();
    }
  }, [token, appointmentId]);

  const markPaymentSuccess = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-success`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error("Payment succeeded but failed to update status.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Payment succeeded but failed to update status.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: { name: cardholderName },
        },
      }
    );

    if (error) {
      console.log(error);
      toast.error(error.message);
    } else if (paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      await markPaymentSuccess();
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-5 border rounded shadow">
      <h2 className="text-lg font-bold mb-4">Complete Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name on Card</label>
          <input
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Cardholder Name"
            required
          />
        </div>
        <div className="p-3 border rounded mb-4">
          <label className="block mb-1 font-medium">Card Details</label>
          <CardElement />
        </div>
        <button
          disabled={!stripe || !clientSecret}
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default StripeCardPayment;
