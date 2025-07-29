import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaCode,
  FaMobileAlt,
  FaShoppingCart,
  FaBullhorn,
} from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import { PiAppStoreLogoLight } from "react-icons/pi";

const services = [
  {
    id: 1,
    icon: <FaCode className="text-blue-500 text-2xl md:text-3xl" />,
    title: "Web Development",
    description:
      "Our Web Developers construct specialised websites and web apps. With the latest online technology in the market.",
  },
  {
    id: 2,
    icon: (
      <PiAppStoreLogoLight className="text-blue-500 text-2xl md:text-3xl" />
    ),
    title: "App Development",
    description:
      "We provide iOS and Android app development services to help you succeed in the competitive mobile app market.",
  },
  {
    id: 3,
    icon: <FaCode className="text-blue-500 text-2xl md:text-3xl" />,
    title: "Software Development",
    description:
      "We provide software development services for startups, businesses looking for custom software solutions.",
  },
  {
    id: 4,
    icon: <FaShoppingCart className="text-blue-500 text-2xl md:text-3xl" />,
    title: "Ecommerce Development",
    description:
      "Custom e-commerce solutions for seamless online transactions. Boost sales and customer engagement with our tailored approach.",
  },
  {
    id: 5,
    icon: <FaBullhorn className="text-blue-500 text-2xl md:text-3xl" />,
    title: "Digital Marketing",
    description:
      "Effective digital marketing campaigns. Engage, convert, and grow your audience with our strategic approach.",
  },
  {
    id: 6,
    icon: <MdDesignServices className="text-blue-500 text-2xl md:text-3xl" />,
    title: "UX/UI Designs",
    description:
      "Enhance user experiences with our expert UI/UX design. Drive engagement and elevate your brand.",
  },
];

const ServicesSection = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait time

    const checkRazorpay = () => {
      if (window.Razorpay) {
        console.log("Razorpay loaded successfully");
        setRazorpayLoaded(true);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkRazorpay, 100);
      } else {
        console.error("Razorpay failed to load after 5 seconds");
        setMessage("Failed to load payment gateway. Please refresh the page.");
      }
    };

    // Start checking immediately
    checkRazorpay();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePayment = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.name || !formData.email) {
      setMessage("Please fill in all required fields");
      return;
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      setMessage(
        "Razorpay SDK not loaded. Please refresh the page and try again."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Create order on backend
      const orderResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/create-order`, {
        amount: Number.parseFloat(formData.amount),
        currency: "INR",
      });

      const { order } = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Regenta International",
        description: "UPI Payment - Scan QR or use UPI apps",
        order_id: order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          location: formData?.location || "",
          payment_type: "upi_with_qr",
        },
        theme: {
          color: "#00D4AA",
          backdrop_color: "rgba(0, 0, 0, 0.5)",
        },
        method: {
          upi: true,
          card: false,
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false,
          cardless_emi: false,
          bank_transfer: false,
        },
        config: {
          display: {
            blocks: {
              utib: {
                name: "UPI",
                instruments: [
                  {
                    method: "upi",
                    flows: ["qr", "collect", "intent"],
                  },
                ],
              },
            },
            sequence: ["block.utib"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        upi: {
          flow: ["qr", "collect", "intent"], // QR first
          apps: ["phonepe", "googlepay", "paytm", "bhim", "amazonpay"],
          qr: {
            show: true,
            size: "medium",
          },
        },
        display: {
          language: "en",
        },
        readonly: {
          email: false,
          contact: false,
        },
        modal: {
          confirm_close: true,
          escape: false,
          animation: true,
          backdropclose: false,
          ondismiss: () => {
            setMessage("Payment cancelled");
            setLoading(false);
          },
        },
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/api/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user: {
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                },
                amount: formData.amount,
              }
            );

            if (verifyResponse.data.success) {
              setMessage("Payment successful! Thank you for your purchase.");
              setFormData({
                amount: "",
                name: "",
                email: "",
                phone: "",
                location: "",
              });
            } else {
              setMessage(
                "Payment verification failed. Please contact support."
              );
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            setMessage("Payment verification failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
      };

      // Create Razorpay instance with error handling
      try {
        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", (response) => {
          setMessage(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });

        rzp.open();
      } catch (razorpayError) {
        console.error("Razorpay initialization error:", razorpayError);
        setMessage("Failed to initialize payment gateway. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  const openPopup = (serviceTitle) => {
    setSelectedService(serviceTitle);
    setFormData({ ...formData, service: serviceTitle });
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedService("");
  };

  return (
    <section id="services" className="py-12 md:py-16 bg-[#f6f9fe]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-10 text-gray-800">
          Our Services
        </h2>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl p-5 sm:p-6 hover:shadow-xl transition duration-300 text-left"
            >
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="p-3 sm:p-4 bg-blue-50 rounded-full shadow-inner">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {service.description}
              </p>
              <button
                onClick={() => openPopup(service.title)}
                className="text-blue-600 text-sm sm:text-base font-medium flex items-center gap-1 hover:underline transition duration-200"
              >
                Buy more <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] transition-opacity duration-300">
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100 data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-lg font-semibold transition-colors duration-200"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Request {selectedService}
            </h3>
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="1"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your location"
              />
            </div> */}

              <button
                type="submit"
                disabled={loading || !razorpayLoaded}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                  loading || !razorpayLoaded
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {!razorpayLoaded
                  ? "Loading Payment Gateway..."
                  : loading
                  ? "Processing..."
                  : "Pay Now"}
              </button>
            </form>
            {message && (
              <div
                className={`mt-4 p-3 rounded-md ${
                  message.includes("successful")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
