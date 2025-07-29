import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="footer" className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <p>Regenta International</p>
          <p className="text-sm">
            RegentaInternational Technologies is a dynamic IT and software
            company, dedicated to excellence in technology solutions.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-3">Contact Us</h3>
          <p className="text-sm">
            <strong>Address:</strong> Delhi, India
          </p>
          <p className="text-sm mt-2">
            <strong>Phone:</strong> +91-7302622997
          </p>
          <p className="text-sm mt-2">
            <strong>Email:</strong> info@regentainternational.in
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-3">Legal</h3>
          <ul className="text-sm space-y-2">
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy & Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Term & Condition
              </Link>
            </li>
            <li>
              <Link to="/return" className="hover:underline">
                Return & Refund
              </Link>
            </li>
            {/* <li>
              <a href="#" className="hover:underline">
                Career
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Blogs
              </a>
            </li> */}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-3">
            Subscribe To Our Newsletter
          </h3>
          <p className="text-sm mb-4">Don’t Miss The Latest Update.</p>
          <div className="flex space-x-3">
            <input
              type="text"
              className="border rounded p-2"
              placeholder="enter your email"
            />
            <button className="bg-blue-600 p-2 rounded-md text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 text-white text-center py-3 text-sm">
        ©2025. Regenta International. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
