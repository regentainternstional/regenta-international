import React from "react";
import { FaRocket, FaPenNib, FaCode, FaVial, FaFileAlt } from "react-icons/fa";

const DevelopmentProcess = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="w-[90%] lg:w-[80%] mx-auto text-center">

        {/* Heading */}
        <h2 className="text-3xl lg:text-4xl font-bold text-[#1554F6]">
          Our Development Process
        </h2>
        <div className="w-24 h-1 bg-red-500 my-4 mx-auto rounded-full"></div>

        {/* Description */}
        <div className="text-gray-600 space-y-5 mt-8 max-w-3xl mx-auto">
          <p>
            At RegentaInternational Technologies, our commitment to excellence shines through
            in our services. We believe in providing unparalleled experiences for
            both our clients and their customers.
          </p>
          <p>
            Our approach begins with a meticulous understanding of your business,
            allowing us to fully comprehend the significance of your ideas. This
            understanding forms the foundation upon which we build innovative
            solutions.
          </p>
          <p>
            Our team of seasoned strategists, designers, and engineers then
            collaborates to craft precise solutions that align with your goals.
            We ensure that every service we provide not only meets but exceeds
            expectations, driving meaningful results for your business.
          </p>
        </div>

        {/* Horizontal Steps Row */}
        <div className="flex flex-wrap justify-center gap-6 mt-16">
          <Step label="Requirement" icon={<FaFileAlt />} />
          <Step label="Designing" icon={<FaPenNib />} />
          <Step label="Development" icon={<FaCode />} />
          <Step label="Testing" icon={<FaVial />} />
          <Step label="Launch" icon={<FaRocket />} active />
        </div>
      </div>
    </section>
  );
};

const Step = ({ label, icon, active = false }) => (
  <div className="flex flex-col items-center justify-center text-center">
    <div
      className={`rounded-full shadow-xl w-20 h-20 flex items-center justify-center text-2xl transition-all duration-300 cursor-pointer
        ${active
          ? "bg-[#1554F6] text-white"
          : "bg-white text-[#1554F6] hover:bg-[#1554F6] hover:text-white"}`}
    >
      {icon}
    </div>
    <span
      className={`mt-2 font-medium transition-colors duration-300 ${
        active ? "text-[#1554F6]" : "text-[#1554F6]"
      }`}
    >
      {label}
    </span>
  </div>
);

export default DevelopmentProcess;
