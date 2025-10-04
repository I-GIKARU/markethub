import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-green-50">
      <Confetti width={dimensions.width} height={dimensions.height} numberOfPieces={300} recycle={false} />
      <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful 🎉</h1>
      <p className="text-lg mb-6">Thanks! We've received your payment.</p>
      <Link to="/" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
        Back to Home
      </Link>
    </div>
  );
}
