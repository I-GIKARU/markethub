// import { useState } from "react";
// import axios from "axios";

// export default function Checkout({ amount: initialAmount = 100 }) {
//   const [paymentMethod, setPaymentMethod] = useState("mpesa");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [amount, setAmount] = useState(initialAmount);
//   const [status, setStatus] = useState("");

//   const isValidAmount = (amt) => amt >= 1 && amt <= 500000;
//   const isLoading = status === "loading";

//   const handleMpesaPay = async (e) => {
//     e.preventDefault();
//     if (!isValidAmount(amount)) return setStatus("Amount must be between 1 and 500,000 KES.");
//     setStatus("loading");
//     try {
//       const res = await axios.post("/api/pay/mpesa", { phone, amount });
//       setStatus("M-Pesa prompt sent. Enter your PIN on your phone.");
//     } catch (err) {
//       setStatus("M-Pesa payment failed.");
//     }
//   };

//   const handleStripePay = async (e) => {
//     e.preventDefault();
//     if (!isValidAmount(amount)) return setStatus("Amount must be between 1 and 500,000 KES.");
//     setStatus("loading");
//     try {
//       const res = await axios.post("/api/pay/stripe", { email, amount });
//       window.location.href = res.data.checkoutUrl;
//     } catch (err) {
//       setStatus("Stripe payment failed.");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
//       <h2 className="text-2xl font-semibold">Checkout</h2>

//       {/* Payment Method Toggle */}
//       <div className="flex gap-4">
//         <button
//           onClick={() => setPaymentMethod("mpesa")}
//           className={`px-4 py-2 rounded ${
//             paymentMethod === "mpesa" ? "bg-green-500 text-white" : "bg-gray-100"
//           }`}
//         >
//           M-Pesa
//         </button>
//         <button
//           onClick={() => setPaymentMethod("stripe")}
//           className={`px-4 py-2 rounded ${
//             paymentMethod === "stripe" ? "bg-purple-600 text-white" : "bg-gray-100"
//           }`}
//         >
//           Stripe
//         </button>
//       </div>

//       {/* Amount Input */}
//       <div>
//         <label className="block">
//           Amount in KES (Max 500,000)
//           <input
//             type="number"
//             value={amount}
//             onChange={(e) => setAmount(Number(e.target.value))}
//             className="w-full border px-3 py-2 rounded mt-1"
//             min={1}
//             max={500000}
//             required
//           />
//         </label>
//       </div>

//       {/* M-Pesa Form */}
//       {paymentMethod === "mpesa" && (
//         <form onSubmit={handleMpesaPay} className="space-y-4">
//           <label className="block">
//             Phone Number (e.g., 2547XXXXXXXX)
//             <input
//               type="tel"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="w-full border px-3 py-2 rounded mt-1"
//               required
//             />
//           </label>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full py-2 rounded ${
//               isLoading
//                 ? "bg-gray-400 cursor-not-allowed text-white"
//                 : "bg-green-600 text-white"
//             }`}
//           >
//             {isLoading ? "Please wait..." : "Pay with M-Pesa"}
//           </button>
//         </form>
//       )}

//       {/* Stripe Form */}
//       {paymentMethod === "stripe" && (
//         <form onSubmit={handleStripePay} className="space-y-4">
//           <label className="block">
//             Email Address
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border px-3 py-2 rounded mt-1"
//               required
//             />
//           </label>
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full py-2 rounded ${
//               isLoading
//                 ? "bg-gray-400 cursor-not-allowed text-white"
//                 : "bg-purple-700 text-white"
//             }`}
//           >
//             {isLoading ? "Please wait..." : "Pay with Stripe"}
//           </button>
//         </form>
//       )}

//       {/* Status Message or Loader */}
//       {status === "loading" ? (
//         <p className="text-center text-sm text-gray-700 mt-4 animate-pulse">
//           Processing... ⏳
//         </p>
//       ) : (
//         status && <p className="text-center text-sm text-gray-700 mt-4">{status}</p>
//       )}
//     </div>
//   );
// }