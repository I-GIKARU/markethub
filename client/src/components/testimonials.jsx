import React, { useState, useEffect, useRef } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles, Zap } from "lucide-react";

const AnimatedTestimonials = () => {
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sam Tomashi",
      designation: "Product Manager at TechFlow",
      src: "https://media.licdn.com/dms/image/v2/D4D03AQHGZ7RLJJThmg/profile-displayphoto-shrink_200_200/B4DZOQSEk1G0Ag-/0/1733292478780?e=2147483647&v=beta&t=ygYhpQW0qsUtzM7yJHn3Gj7IBuTMydzMgfUKmvOiqb0",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Rose Momanyi",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Shamim",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Ken Tuei",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "Aaron Rashid",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Elvis Otieno",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop",
    },
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index) => index === active;

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black py-20 overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Header Section */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-6">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Customer
            </span>
            <span className="text-white"> Reviews</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Experience testimonials from tomorrow's innovators who are already
            living in the future with our revolutionary merchandise.
          </p>

          {/* Stats Bar */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">4.9★</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">2.1K+</div>
              <div className="text-gray-400 text-sm">Reviews</div>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">98%</div>
              <div className="text-gray-400 text-sm">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 max-w-5xl mx-auto py-10">
          {/* Image Section */}
          <div className="relative h-72 w-72">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name + index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -60, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={
                      testimonial.src ||
                      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=2070&auto=format&fit=crop"
                    }
                    alt={testimonial.name}
                    className="h-full w-full rounded-3xl object-cover object-center"
                    draggable={false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Text Section */}
          <div className="text-center lg:text-left max-w-xl">
            <motion.div
              key={active}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <h3 className="text-2xl font-bold text-white">
                {testimonials[active].name}
              </h3>
              <p className="text-sm text-gray-400">
                {testimonials[active].designation}
              </p>
              <motion.p className="mt-6 text-lg text-gray-200">
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
            </motion.div>

            {/* Arrows */}
            <div className="flex justify-center lg:justify-start gap-4 pt-10">
              <button
                onClick={handlePrev}
                className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <IconArrowLeft className="h-5 w-5 text-white group-hover/button:rotate-12 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="group/button flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <IconArrowRight className="h-5 w-5 text-white group-hover/button:-rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedTestimonials;