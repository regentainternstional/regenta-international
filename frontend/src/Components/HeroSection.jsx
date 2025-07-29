import React from 'react';
import { FaStar } from 'react-icons/fa';
import heroImg from '../assets/hero-image.jpg';

const HeroSection = () => {
  return (
    <section id="home" className="relative bg-[#e9f2ff] flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImg})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6">
        {/* Subheading */}
        <p className="text-sm sm:text-base text-blue-600 font-semibold uppercase mb-4">
          We Help You To
        </p>

        {/* Rating */}
        <div className="flex justify-center items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div className="flex text-yellow-400 text-base sm:text-xl">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
          <span className="text-gray-700 font-medium text-sm sm:text-lg">
            Google 4.8/5 rating
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 sm:mb-6 leading-snug sm:leading-tight">
          Shape Your <br />
          Business at <span className="text-blue-600">Regenta International</span>
        </h1>

        {/* Paragraph */}
        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          Welcome to our portfolio page, where we proudly showcase a diverse range of
          projects that exemplify the quality and creativity of our work at Regenta International.
          Explore our featured projects to gain insights into our capabilities and discover
          how we can help bring your ideas to life.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
