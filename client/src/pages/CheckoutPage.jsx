// // src/pages/CheckoutPage.jsx
// import { motion } from "framer-motion";
// import Checkout from "../components/Checkout";
// import { Boxes } from "../components/ui/Boxes"; 

// export default function CheckoutPage() {
//   const amountFromCartOrProject = 1000; 

//   return (
//     <div className="relative min-h-screen bg-gray-900 flex items-center justify-center py-10 px-4 overflow-hidden">
//       <Boxes /> 
      
//       <motion.div
//         className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-12"
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//       >
//         {/* Step Indicator */}
//         <div className="mb-6 text-sm text-gray-600 uppercase tracking-wide flex items-center justify-center gap-2">
//           <span className="h-2 w-2 bg-green-500 rounded-full" />
//           Step 2 of 2 — Payment
//         </div>

//         {/* Heading */}
//         <div className="mb-8 text-center">
//           <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
//             Complete Your Purchase
//           </h1>
//           <p className="text-gray-600 text-lg">
//             You’re almost there! Just one more step.
//           </p>
//         </div>

//         {/* Summary + Checkout */}
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Order Summary */}
//           <div className="bg-white border border-gray-200 p-6 rounded-xl">
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">
//               Order Summary
//             </h2>
//             <ul className="space-y-3 text-gray-700">
//               <li className="flex justify-between">
//                 <span>Project Access</span>
//                 <span>KES {amountFromCartOrProject}</span>
//               </li>
//               <li className="flex justify-between font-semibold">
//                 <span>Total</span>
//                 <span>KES {amountFromCartOrProject}</span>
//               </li>
//             </ul>
//           </div>

//           {/* Checkout Component */}
//           <div>
//             <Checkout amount={amountFromCartOrProject} />
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
