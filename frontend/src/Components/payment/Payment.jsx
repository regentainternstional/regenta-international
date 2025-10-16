import { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const decodedTitle = decodeURIComponent(id);
  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [currentUserDataId, setCurrentUserDataId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [message, setMessage] = useState("");
  // const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const paymentFormRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const txnId = searchParams.get("txnId");

    if (location.pathname.includes("/payment/success") && txnId) {
      setMessage("Payment successful! Loading next user data...");
      setIsTransitioning(true);
      fetchNextUserData().then((hasNextData) => {
        if (hasNextData) {
          setMessage("Payment successful! Form updated with next user data.");
        } else {
          setMessage("Payment successful! No more user data available.");
        }
        setIsTransitioning(false);
        // Clean up URL
        navigate(`/payment/${id}`, { replace: true });
      });
    } else if (location.pathname.includes("/payment/failed")) {
      setMessage("Payment failed. Please try again.");
      navigate(`/payment/${id}`, { replace: true });
    }
  }, [location]);

  const fetchNextUserData = async () => {
    try {
      setFetchingData(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/user-data/next`
      );

      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        setFormData({
          amount: userData.amount.toString(),
          name: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          location: "",
        });
        setCurrentUserDataId(userData._id);
        // console.log("[v0] Auto-filled form with user data:", userData)
        return true;
      } else {
        setFormData({
          amount: "",
          name: "",
          email: "",
          phone: "",
          location: "",
        });
        setCurrentUserDataId(null);
        setMessage("No user data available. Please contact admin.");
        // console.log("[v0] No unprocessed user data found")
        return false;
      }
    } catch (error) {
      console.error("[v0] Error fetching user data:", error);
      setMessage(
        "Failed to load user data. You can still enter details manually."
      );
      return false;
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchNextUserData();
  }, []);

  // useEffect(() => {
  //   let attempts = 0;
  //   const maxAttempts = 50;

  //   const checkRazorpay = () => {
  //     if (window.Razorpay) {
  //       console.log("Razorpay loaded successfully");
  //       setRazorpayLoaded(true);
  //     } else if (attempts < maxAttempts) {
  //       attempts++;
  //       setTimeout(checkRazorpay, 100);
  //     } else {
  //       console.error("Razorpay failed to load after 5 seconds");
  //       setMessage("Failed to load payment gateway. Please refresh the page.");
  //     }
  //   };

  //   checkRazorpay();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!formData.amount || !formData.name || !formData.email) {
      setMessage("Please fill in all required fields")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      console.log("[v0] Sending payment request with data:", {
        amount: Number.parseFloat(formData.amount),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userDataId: currentUserDataId,
      })

      // Create SabPaisa payment request
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/sabpaisa/create-payment`, {
        amount: Number.parseFloat(formData.amount),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        userDataId: currentUserDataId,
      })

      console.log("[v0] Payment response:", response.data)

      if (response.data.success) {
        const form = document.createElement("form")
        form.method = "POST"
        form.action = response.data.paymentUrl

        // Add encrypted data
        const encDataInput = document.createElement("input")
        encDataInput.type = "hidden"
        encDataInput.name = "encData"
        encDataInput.value = response.data.encData
        form.appendChild(encDataInput)

        // Add client code
        const clientCodeInput = document.createElement("input")
        clientCodeInput.type = "hidden"
        clientCodeInput.name = "clientCode"
        clientCodeInput.value = response.data.clientCode
        form.appendChild(clientCodeInput)

        console.log("[v0] Submitting form to SabPaisa with:", {
          paymentUrl: response.data.paymentUrl,
          encData: response.data.encData,
          clientCode: response.data.clientCode,
        })

        document.body.appendChild(form)
        form.submit()
      } else {
        setMessage("Failed to initiate payment. Please try again.")
        setLoading(false)
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      setMessage("Failed to initiate payment. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="bg-white">
      <Link to="/" className="max-w-7xl mx-auto">
        <button className="ml-20 mt-10 bg-blue-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-blue-600 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </Link>

      <div className="flex items-center justify-center">
        <div className="rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 mt-16 shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Request {decodedTitle}</h3>
          {fetchingData ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading user data...</span>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="space-y-6" ref={paymentFormRef}>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
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

              <button
                type="submit"
                disabled={loading || isTransitioning}
                className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
                  loading || isTransitioning
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {loading ? "Redirecting to Payment..." : isTransitioning ? "Updating..." : "Pay Now"}
              </button>
            </form>
          )}
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
    </div>
  );
}
