import React from 'react'
import { AnimatedTooltipPreview } from "../components/contactus";
import { HerosSection } from "../components/back";
import Carousel from "../components/carousel";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import MerchCard from "../components/merchpreview";
import AnimatedTestimonialsDemo from "../components/testimonials";
import AboutAnimation from "./AnimatedStatics"


const Landingpage = () => {
  return (
    <div>
      <Navbar />
      <HerosSection />
      {/* <AnimatedTooltipPreview /> */}
      {/* <AboutAnimation /> */}
      <AboutAnimation />
      <Carousel />
      <MerchCard />
      <AnimatedTestimonialsDemo />
      <Footer />
    </div>
  );
}

export default Landingpage
