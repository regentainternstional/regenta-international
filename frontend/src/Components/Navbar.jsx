import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleNavClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // close mobile menu
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%]">
      <nav className="bg-white rounded-xl shadow-md px-6 py-3 flex items-center justify-between relative">
        
        {/* Logo */}
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
          <span className="text-blue-600 pr-1">Regenta</span>
          <span className="text-gray-700 font-extrabold">International</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 font-medium text-gray-800">
          <li onClick={() => handleNavClick('home')} className="hover:text-blue-600 cursor-pointer">Home</li>
          <li onClick={() => handleNavClick('services')} className="hover:text-blue-600 cursor-pointer">Our Services</li>
          <li onClick={() => handleNavClick('testimonials')} className="hover:text-blue-600 cursor-pointer">Testimonials</li>
          <li onClick={() => handleNavClick('faq')} className="hover:text-blue-600 cursor-pointer">FAQ</li>
          <li onClick={() => handleNavClick('footer')} className="hover:text-blue-600 cursor-pointer">Footer</li>
        </ul>

        {/* Contact Us Button */}
        <button className="hidden md:block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md font-medium shadow-sm">
          Contact Us
        </button>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-800 text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <ul className="absolute top-full left-0 w-full bg-white rounded-b-xl shadow-md flex flex-col items-start px-6 py-4 space-y-4 font-medium text-gray-800 md:hidden">
            <li onClick={() => handleNavClick('home')} className="hover:text-blue-600 cursor-pointer">Home</li>
            <li onClick={() => handleNavClick('services')} className="hover:text-blue-600 cursor-pointer">Our Services</li>
            <li onClick={() => handleNavClick('testimonials')} className="hover:text-blue-600 cursor-pointer">Testimonials</li>
            <li onClick={() => handleNavClick('faq')} className="hover:text-blue-600 cursor-pointer">FAQ</li>
            <li onClick={() => handleNavClick('footer')} className="hover:text-blue-600 cursor-pointer">Footer</li>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md font-medium w-full text-center shadow-sm">
              Contact Us
            </button>
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
