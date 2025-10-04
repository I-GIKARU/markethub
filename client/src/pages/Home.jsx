import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Zap,
  Shield,
  Cpu,
  Rocket,
  Eye,
  Brain,
  Globe,
    ArrowUp,
  ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedTooltipPreview } from "../components/contactus";
import Footer from "../components/footer";

const App11 = () => {
  // Renamed from FuturisticHomepage to App11
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  const backgroundImages = [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",
    "https://motionarray.imgix.net/preview-48500CXyqzjtUPH_0000.jpg?w=660&q=60&fit=max&auto=format",
    "https://static.vecteezy.com/system/resources/thumbnails/042/383/337/small_2x/ai-generated-green-natural-eco-friendly-tree-and-computer-technology-on-an-abstract-high-tech-futuristic-background-of-microchips-and-computer-circuit-boards-with-transistors-free-video.jpg",
    "https://img.freepik.com/premium-photo/solarpunk-sustainable-energy-arboreal-tech-fusion-wallpaper-with-copy-space-futuristic-digital-landscape-with-clean_924727-39235.jpg",
    "https://media.istockphoto.com/id/1345011011/photo/financial-technologies-binary-code-background-with-dollar-banknotes.jpg?s=612x612&w=0&k=20&c=WGFmxUxB2AAsFFg9VQVOW5YTB7JF9RX3QnJl9zz0uVo=",
  ];

  // Particle system
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 0.5 + 0.1,
    opacity: Math.random() * 0.8 + 0.2,
  }));

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const particleInterval = setInterval(() => {
      // setActiveParticle((prev) => (prev + 1) % particles.length); // Removed activeParticle state and its usage as it's not visually used
    }, 100);

    // Change background images
    const bgInterval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 8000);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearInterval(particleInterval);
      clearInterval(bgInterval);
    };
  }, [backgroundImages.length, particles.length]); // Added particles.length to dependencies

  const features = [
    {
      icon: Brain,
      title: "Smart Search",
      desc: "Find projects and merch that match your vibe",
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: Shield,
      title: "Secure & Verified",
      desc: "Only real students. Only trusted products.",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Cpu,
      title: "Project Engine",
      desc: "Explore bold ideas ready to launch.",
      color: "from-purple-400 to-violet-500",
    },

  ];
  
  

  const HolographicCard = ({ children, className = "", delay = 0 }) => (
    <div
      className={`relative group transform transition-all duration-1000 hover:scale-105 ${className}`}
      style={{
        animationDelay: `${delay}s`,
        transform: `rotateX(${scrollY * 0.02}deg) rotateY(${
          (mousePos.x - window.innerWidth / 2) * 0.01
        }deg)`,
      }}
    >
      <div className="relative bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 group-hover:border-cyan-400/60 transition-all duration-700">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl"></div>
        {children}
      </div>
    </div>
  );

  const ParticleField = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <div
          key={particle.id}
          className={`absolute w-1 h-1 bg-cyan-400 rounded-full transition-all duration-1500`} 
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDelay: `${i * 0.1}s`,
            transform: `translate(${Math.sin(scrollY * 0.01 + i) * 20}px, ${
              Math.cos(scrollY * 0.01 + i) * 20
            }px)`,
          }}
        />
      ))}
    </div>
  );

  const NeonText = ({ children, className = "" }) => (
    <span className={`relative ${className}`}>
      {children}
      <span className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
        {children}
      </span>
    </span>
  );

  return (
    <div className="min-h-screen text-white overflow-hidden relative bg-black">
      {/* Full Width Background Images */}
      <div className="fixed inset-0 z-0">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-3000 ${
              // Increased duration
              index === currentBg ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              transform: `scale(${1 + scrollY * 0.0007})`, // Increased scale
            }}
          />
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

        {/* Futuristic overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-purple-900/20" />
      </div>

      {/* Particle Field */}
      {/* <ParticleField /> */}

      {/* Dynamic Lighting Effects */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div
          className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePos.x - 200}px`,
            top: `${mousePos.y - 200}px`,
            transition: "all 0.6s ease-out", // Increased transition speed
          }}
        />
        <div
          className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePos.x - 150}px`,
            top: `${mousePos.y - 150}px`,
            transition: "all 0.9s ease-out", // Increased transition speed
            animationDelay: "0.5s",
          }}
        />
      </div>

      {/* Background Image Indicators */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              index === currentBg
                ? "bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50"
                : "bg-white/30 hover:bg-white/50"
            }`}
            onClick={() => setCurrentBg(index)}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div
            className={`flex justify-between items-center transform transition-all duration-1500 ${
              // Increased duration
              isLoaded
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            }`}
          >
            <div className="text-2xl font-bold">
              <NeonText className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 bg-clip-text">
                Innovation
                <br />
                Marketplace
              </NeonText>
            </div>

            <div className="hidden md:flex space-x-8">
              {[
                { name: "Projects", path: "/projects" },
                { name: "Merchs", path: "/shop" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "LogOut", path: "/" },
              ].map((item, i) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative group px-4 py-2 transition-all duration-300 hover:text-green-500 text-bold"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                  <div className="absolute inset-0 border border-cyan-500/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className=" relative z-40 px-6 py-20 min-h-screen flex items-center justify-center">
        {" "}
        {/* Added justify-center here */}
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-16 items-center justify-center">
            {" "}
            {/* Modified to flexbox for centering */}
            {/* Hero Content */}
            <div
              className={`space-y-8 transform transition-all duration-1500 delay-300 text-center ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }`}
            >
              <div className="space-y-4 mt-0">
                <h1 className="text-2xl lg:text-6xl font-black leading-none">
                  <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent animate-pulse">
                    FUTURE IS NOW
                  </div>
                </h1>
              </div>

              <p className="text-xl text-gray-300 leading-relaxed font-bold font-playwright">
                Experience the convergence of artificial intelligence, quantum
                computing,
                <br />
                and neural interfaces. Step into tomorrow&apos;s technology
                today.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/shop">
                  <button className="group relative px-8 py-4 bg-green-500 rounded-full font-bold text-lg overflow-hidden transform transition-all duration-500 hover:scale-105">
                    <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2">
                      <ShoppingCart className="w-6 h-6" /> Explore Store
                    </div>
                  </button>
                </Link>
                <Link to="/projects">
                  <button className="group relative px-8 py-4 border-2 border-cyan-400 rounded-full font-bold text-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:border-purple-400">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center">
                      Explore Projects
                      <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </Link>
              </div>
            </div>
            <div
              className={`relative transform transition-all duration-1000 delay-700 ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            >
              <div className="relative w-full h-96">
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm"></div>
                  <div className="absolute inset-0 border border-cyan-400/50 rounded-3xl animate-pulse"></div>

                  {/* Central Core */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full animate-spin opacity-80"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full"></div>
                      <div className="absolute inset-6 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
                        🧠
                      </div>
                    </div>
                  </div>

                  {/* Orbiting Elements */}
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-4 h-4 bg-cyan-400 rounded-full"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${
                          i * 90 + scrollY * 0.5
                        }deg) translateX(120px)`,
                        animationDelay: `${i * 0.25}s`,
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
                    </div>
                  ))}

                  {/* Data Streams */}
                  <div className="absolute inset-4 border border-cyan-400/30 rounded-2xl">
                    <div className="p-4 space-y-2 font-mono text-sm">
                      {[
                        "NEURAL_ACTIVITY: 98.7%",
                        "QUANTUM_STATE: STABLE",
                        "AI_LEARNING: ACTIVE",
                        "SYNC_STATUS: OPTIMAL",
                      ].map((line, i) => (
                        <div
                          key={i}
                          className={`text-cyan-400 transition-opacity duration-500`}
                          style={{ animationDelay: `${i * 0.5}s` }}
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-40 px-6 py-32 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">
              <NeonText className="bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                Built for Brilliance
              </NeonText>
            </h2>
            <p className="text-xl text-gray-500 font-light">
              Technology that elevates student ideas into global solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <HolographicCard key={feature.title} delay={index * 0.2}>
                <div className="relative z-10">
                  <div
                    className={`mb-6 p-4 bg-gradient-to-br ${feature.color} rounded-xl w-fit transform group-hover:scale-110 transition-all duration-500`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-cyan-300 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors font-light">
                    {feature.desc}
                  </p>
                </div>
              </HolographicCard>
            ))}
          </div>
        </div>
      </section>

      {/* Matrix Stats */}
      <section className="relative z-40 px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <AnimatedTooltipPreview />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default App11;