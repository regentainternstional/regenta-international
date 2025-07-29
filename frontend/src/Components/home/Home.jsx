import React from "react";
import Navbar from "../Navbar";
import HeroSection from "../HeroSection";
import ServicesSection from "../ServiceSection";
import DevelopmentProcess from "../DevelopmentProcess";
import IndustriesSection from "../Industries";
import WhyNexzem from "../WhyNexzem";
import Testimonials from "../Testinonials";
import ConatctUs from "../Contact";
import FAQSection from "../FAQSection";
import Footer from "../Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <DevelopmentProcess />
      <IndustriesSection />
      <WhyNexzem />
      <Testimonials />
      <ConatctUs />
      <FAQSection />
      <Footer />
    </>
  );
}
