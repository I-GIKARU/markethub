// src/pages/PaymentCancel.jsx
import { Link } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled ❌</h1>
      <p className="text-lg mb-6">Looks like you cancelled the payment. Want to try again?</p>
      <Link
        to="/checkout"
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Return to Checkout
      </Link>
    </div>
  );
}
