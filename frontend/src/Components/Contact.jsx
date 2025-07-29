import React from "react";
import Contact from "../assets/contact.jpg"

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        {/* Left: Form */}
        <div className="bg-white p-6 sm:p-10 shadow-xl rounded-2xl border border-blue-100 h-full">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Contact Us</h2>
          <p className="text-gray-500 mb-8">
            Have a question or want to work with us? Fill out the form below!
          </p>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Message
              </label>
              <textarea
                rows="5"
                placeholder="Type your message..."
                className="mt-1 block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right: Info panel */}
        <div className="bg-blue-50 p-6 sm:p-10 rounded-2xl border border-blue-100 shadow-md h-full">
          <h3 className="text-2xl font-semibold text-blue-700 mb-6">
            Get in Touch
          </h3>
          <ul className="space-y-4 text-blue-900">
            <li>
              📧 <span className="font-medium">Email:</span>{" "}
              <a
                href="mailto:hello@example.com"
                className="underline hover:text-blue-600"
              >
               info@regentainternational.in
              </a>
            </li>
            <li>
              📞 <span className="font-medium">Phone:</span>{" "}
              <a
                href="tel:+919999999999"
                className="underline hover:text-blue-600"
              >
                +91 7248074661
              </a>
            </li>
            <li>
              📍 <span className="font-medium">Address:</span> Delhi, India
            </li>
          </ul>

          <div className="mt-10">
            {/* <iframe
              title="Google Map"
              className="w-full rounded-xl h-56 border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.2577306122453!2d78.03219121512096!3d30.31649548177213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909298b99f10fbd%3A0x9aa4cf2e4a40df5c!2sClock%20Tower%2C%20Dehradun!5e0!3m2!1sen!2sin!4v1619773366769!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
            ></iframe> */}
            <img src={Contact} alt="contact-us" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
