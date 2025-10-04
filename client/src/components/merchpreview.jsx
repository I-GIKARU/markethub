"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


// Utility for combining class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function MerchCard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black px-4 py-10 w-screen">
      {/* Title */}
      <h2 className="text-white text-3xl font-bold mb-10 text-center">
        Merchandise
      </h2>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-7xl">
        {cardData.map((card, index) => (
          <BackgroundGradient
            key={index}
            className="text-white h-full"
            containerClassName="w-[300px] h-[500px]"
          >
            <div className="rounded-[20px] bg-zinc-900 p-6 sm:p-6 flex flex-col h-full">
              <img
                src={card.image}
                alt={card.title}
                className="object-contain w-100 h-100 mb-4"
              />

              {/* Push content to bottom */}
              <div className="flex-grow" />

              <div className="space-y-1">
                <p className="text-lg font-semibold">{card.title}</p>
                <p className="text-sm text-neutral-400 line-clamp-3">
                  {card.description}
                </p>
              </div>

              <div className="mt-4">
                <button className="cursor-pointer rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800 hover:bg-zinc-700 transition">
                  <span>Buy now</span>
                  <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
                    {card.price}
                  </span>
                </button>
              </div>
            </div>
          </BackgroundGradient>
        ))}
      </div>

      {/* View More Button */}
      <Link to = "/signup">
        <button className="mt-10 rounded-full bg-white text-black font-semibold px-6 py-2 hover:bg-neutral-200 transition">
          View More
        </button>
      </Link>
    </div>
  );
}


const cardData = [
  {
    title: "Air Jordan 4 Retro",
    description:
      "Celebrate heritage with the reimagined AJ4 'Bred'. Dropping Feb 17, 2024 – your best shot is through raffles. Don’t miss out!",
    price: "Ksh 14,500",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-w4xPOgS05_VO4weMI62UTjooqhEuORSeYQ&s",
  },
  {
    title: "Water Bottle",
    description:
      "Sleek and durable 650ml Tritan™ bottle. Leakproof, lightweight, and built for daily hydration on the go.",
    price: "Ksh 9,000",
    image:
      "https://www.lifesystems.co.uk/cdn/shop/files/74250-tritan-bottle-650ml-grey-lifestyle-1.jpg?height=1092&v=1697708833&width=1092",
  },
  {
    title: "Yeezy Slide Pure",
    description:
      "Iconic Yeezy Slides in 'Pure' – ultra-soft, minimalist, and versatile. Slip into all-day comfort.",
    price: "Ksh 11,600",
    image:
      "https://ke.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/22/986196/1.jpg?7445",
  },
];


// Border Gradient Component
export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}) => {
  const variants = {
    initial: { backgroundPosition: "0% 50%" },
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    },
  };

  return (
    <div
      className={cn(
        "relative group rounded-[24px] p-[2px]",
        containerClassName
      )}
    >
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ backgroundSize: "400% 400%" }}
        className={cn(
          "absolute inset-0 z-0 rounded-[24px]",
          "bg-[conic-gradient(from_0deg,#00ccb1,#7b61ff,#ffc414,#1ca0fb,#00ccb1)]",
          "transition duration-500 group-hover:blur-sm"
        )}
      />
      <div className="relative z-10 rounded-[22px] bg-black p-[2px] h-full">
        <div className={cn("rounded-[20px] h-full", className)}>{children}</div>
      </div>
    </div>
  );
};
