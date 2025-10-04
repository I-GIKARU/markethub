import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function MpesaPayment() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Retrieve the totalAmount from the navigation state
    if (location.state && location.state.totalAmount) {
      // Prepend "KSh." to the amount string for display
      setAmount("KSh." + location.state.totalAmount.toFixed(2));
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // IMPORTANT: When sending to the backend, you need to extract the numeric value
    // from the 'amount' state by removing "KSh."
    const amountToSend = parseFloat(amount.replace("KSh.", ""));

    // Basic validation to ensure a valid number is sent
    if (isNaN(amountToSend) || amountToSend <= 0) {
      setResponse({ error: "Invalid amount for M-Pesa STK Push." });
      return;
    }

    try {
      const res = await fetch("/stk_push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, amount: amountToSend }), // Send the numeric amount
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error during STK push request:", error);
      setResponse({ error: "Failed to initiate M-Pesa STK Push." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 p-2 rounded-full text-teal-300 hover:text-white transition cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center tracking-wider text-teal-300">
          M-Pesa STK Push
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" // Changed to "text" because it now includes "KSh."
            placeholder="Phone (2547...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
          <input
            type="text" // Keep as "text" because it now includes "KSh."
            placeholder="Amount"
            value={amount} // Value is now pre-filled with "KSh."
            readOnly // Make it read-only
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition shadow-lg hover:shadow-teal-500/50"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}


// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";

// export default function MpesaPayment() {
//   const [phone, setPhone] = useState("");
//   const [amount, setAmount] = useState("");
//   const [response, setResponse] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state && location.state.totalAmount) {
//       setAmount("KSh." + location.state.totalAmount.toFixed(2));
//     }
//   }, [location.state]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const amountToSend = parseFloat(amount.replace("KSh.", ""));

//     if (isNaN(amountToSend) || amountToSend <= 0) {
//       setResponse({ error: "Invalid amount for M-Pesa STK Push." });
//       return;
//     }

//     try {
//       const res = await fetch("/stk_push", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ phone, amount: amountToSend }),
//       });
//       const data = await res.json();
//       setResponse(data);
//     } catch (error) {
//       console.error("Error during STK push request:", error);
//       setResponse({ error: "Failed to initiate M-Pesa STK Push." });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 relative">
//       <button
//         onClick={() => navigate(-1)}
//         className="absolute top-6 left-6 text-teal-300 hover:text-white transition"
//         aria-label="Go back"
//       >
//         <ArrowLeft className="w-6 h-6" />
//       </button>

//       <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white border border-white/20">
//         <h1 className="text-3xl font-bold mb-6 text-center tracking-wider text-teal-300">
//           M-Pesa STK Push
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Phone (2547...)"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
//           />
//           <input
//             type="text"
//             placeholder="Amount"
//             value={amount}
//             readOnly
//             className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white cursor-not-allowed"
//           />

//           {/* ✅ Futuristic Glow Button */}
//           <button
//             type="submit"
//             className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 
//               hover:from-teal-600 hover:to-blue-600 text-white font-bold rounded-xl 
//               transition duration-300 ease-in-out transform hover:scale-105 
//               shadow-lg hover:shadow-cyan-400/50 focus:outline-none focus:ring-4 focus:ring-cyan-300/50"
//           >
//             Pay Now
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
