import React from "react";
import whyImage from "../assets/hero-image.jpg";

const WhyRegenta = () => {
  const features = [
    { icon: "💰", title: "Competitive Pricing" },
    { icon: "🤝", title: "Customer Satisfaction" },
    { icon: "👨‍💻", title: "Skilled IT Experts" },
    { icon: "🎧", title: "Best Service & Support" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Text Content */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
            Why <span className="text-blue-600">Regenta International</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            Regenta International is dedicated to providing exceptional software solutions,
            setting industry standards with our innovative approach. Our client-centric
            philosophy drives us to deeply understand each business we work with,
            ensuring our solutions are precisely tailored to meet their needs.
          </p>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            With a track record of successful projects across various industries, we are
            constantly striving for improvement and innovation. Our ultimate goal is
            customer satisfaction, and we are relentless in our pursuit to deliver the
            best possible outcomes for our clients.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-100 flex items-center justify-center text-xl sm:text-2xl text-blue-600 mb-2">
                  {feature.icon}
                </div>
                <p className="text-gray-700 text-xs sm:text-sm">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <div className="absolute inset-0 rounded-full bg-blue-50 transform rotate-12"></div>
            <img
              src={whyImage}
              alt="Why Regenta International"
              className="relative z-10 rounded-lg w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyRegenta;
