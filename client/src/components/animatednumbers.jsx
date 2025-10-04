import { useState, useEffect } from "react";

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startCount = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(
        easeOutQuart * (end - startCount) + startCount
      );

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span className="text-4xl md:text-5xl font-bold text-black">
      {count}
      {suffix}
    </span>
  );
};

const StatCard = ({ value, suffix, label, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`text-center transform transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="mb-2">
        {isVisible && (
          <AnimatedCounter
            end={value}
            duration={2000 + delay}
            suffix={suffix}
          />
        )}
      </div>
      <div className="text-gray-600 text-sm md:text-base font-medium tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
};

export default function AnimatedStats() {
  return (
    <div className="bg-white px-8 py-12 md:px-16 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center gap-4 md:gap-8">
          <StatCard value={500} suffix="+" label="Students" delay={0} />
          <StatCard value={150} suffix="+" label="Projects" delay={200} />
          <StatCard value={50} suffix="+" label="Recruiters" delay={400} />
          <StatCard value={95} suffix="%" label="Success Rate" delay={600} />
        </div>
      </div>
    </div>
  );
}
