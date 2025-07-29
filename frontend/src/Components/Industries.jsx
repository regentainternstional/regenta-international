import React from "react";
import {
  FaHospital,
  FaShoppingCart,
  FaCreditCard,
  FaUtensils,
  FaBookOpen,
  FaHome,
  FaTaxi,
  FaEllipsisH,
} from "react-icons/fa";

const industries = [
  { name: "Healthcare", icon: <FaHospital size={30} className="text-blue-600" /> },
  { name: "ECommerce", icon: <FaShoppingCart size={30} className="text-blue-600" /> },
  { name: "Finance", icon: <FaCreditCard size={30} className="text-blue-600" /> },
  { name: "Restaurant", icon: <FaUtensils size={30} className="text-blue-600" /> },
  { name: "Education", icon: <FaBookOpen size={30} className="text-blue-600" /> },
  { name: "Real Estate", icon: <FaHome size={30} className="text-blue-600" /> },
  { name: "Tours & Travel", icon: <FaTaxi size={30} className="text-blue-600" /> },
  { name: "More Services", icon: <FaEllipsisH size={30} className="text-blue-600" /> },
];

const IndustriesSection = () => {
  return (
    <section className="bg-blue-400 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-white">Industries We Serve</h2>
        <p className="text-white mt-4 text-base max-w-2xl mx-auto">
          Our expertise ensures that each industry receives customized services to meet their unique needs.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4 flex items-center justify-center">
                {industry.icon}
              </div>
              <h3 className="text-gray-800 font-semibold text-lg">{industry.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
