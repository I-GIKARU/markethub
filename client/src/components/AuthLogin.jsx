import React, { useState, useEffect } from "react";

// You might need to fetch the orderId and initialAmount from your application's state or props
// For demonstration, we'll use dummy values.
// In a real app, this component would receive props like `orderId` and `totalAmount`.

const MpesaPaymentForm = ({ orderId = 123, initialAmount = 10.0 }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState(initialAmount.toFixed(2)); // Format to 2 decimal places
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Optional: If you need to fetch a JWT token for authorization
  // useEffect(() => {
  //     const token = localStorage.getItem('access_token'); // Or from your auth context
  //     if (token) {
  //         // setAuthToken(token);
  //     }
  // }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (!phoneNumber || !amount) {
      setMessage("Please enter both phone number and amount.");
      setLoading(false);
      return;
    }

    if (
      !phoneNumber.startsWith("2547") ||
      phoneNumber.length !== 12 ||
      !/^\d+$/.test(phoneNumber)
    ) {
      setMessage("Invalid phone number format. Use 2547XXXXXXXX.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/mpesa/stkpush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If your /api/mpesa/stkpush endpoint requires authentication,
          // uncomment and replace `yourAuthToken` with the actual token.
          // 'Authorization': `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          amount: parseFloat(amount), // Ensure amount is a number
          order_id: orderId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "M-Pesa STK Push initiated! Please check your phone to complete the payment."
        );
        // You might want to redirect the user or show a success state
        // Example: setTimeout(() => window.location.href = `/orders/${orderId}`, 3000);
      } else {
        setMessage(
          `Payment failed: ${data.msg || data.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error initiating M-Pesa STK Push:", error);
      setMessage(
        "An error occurred while trying to process your payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          M-Pesa Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="order_id"
              className="block text-sm font-medium text-gray-700"
            >
              Order ID:
            </label>
            <input
              type="text"
              id="order_id"
              value={orderId}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (Ksh):
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number (e.g., 2547XXXXXXXX):
            </label>
            <input
              type="tel" // Use tel for phone numbers
              id="phone_number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="2547XXXXXXXX"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing Payment..." : "Pay with M-Pesa"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-md text-sm ${
              message.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>
      {/* Tailwind CSS CDN for styling */}
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
};

export default MpesaPaymentForm;
