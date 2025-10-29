import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Payment() {
  const { id: service } = useParams();
  const navigate = useNavigate();
  const decodedService = decodeURIComponent(service);

  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    phone: "",
    email: "",
  });
  const [lastName, setLastName] = useState("");
  const [autofillDataId, setAutofillDataId] = useState(null);
  const [errors, setErrors] = useState({
    amount: "",
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validateForm = () => {
    const newErrors = { amount: "", name: "", phone: "", email: "" };
    let isValid = true;

    if (!formData.amount) {
      newErrors.amount = "Amount is required.";
      isValid = false;
    } else if (
      isNaN(formData.amount) ||
      Number.parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Amount must be a positive number.";
      isValid = false;
    }

    if (!formData.name) {
      newErrors.name = "First Name is required.";
      isValid = false;
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
      newErrors.name =
        "Name can only contain letters, spaces, hyphens, or apostrophes.";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLastNameChange = async (e) => {
    const value = e.target.value;
    setLastName(value);

    // Silently check if the entered value matches the auto-fill code
    if (value.trim()) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/verify-autofill-code`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: value }),
          }
        );

        const data = await res.json();

        if (data.success) {
          // Silently auto-fill the form fields
          setFormData({
            amount: "", // Keep amount empty for user to fill
            name: data.data.name,
            phone: data.data.phone,
            email: data.data.email,
          });
          setAutofillDataId(data.data.id);
        }
        // If code is wrong, do nothing - no error messages
      } catch (error) {
        // Silently fail - no error messages to user
        console.error("Error verifying code:", error);
      }
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setGeneralError("");
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      const orderId = "order_" + Date.now();
      const gatewayRes = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/get-gateway`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!gatewayRes.ok) {
        throw new Error("Failed to determine payment gateway");
      }

      const { gateway } = await gatewayRes.json();
      console.log(`Using ${gateway} gateway`);

      if (gateway === "sabpaisa") {
        // Create SabPaisa payment request
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/sabpaisa/create-payment`,
          {
            amount: Number.parseFloat(formData.amount),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            order_id: orderId,
          }
        );
        if (response.data.success) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = response.data.paymentUrl;

          // Add encrypted data
          const encDataInput = document.createElement("input");
          encDataInput.type = "hidden";
          encDataInput.name = "encData";
          encDataInput.value = response.data.encData;
          form.appendChild(encDataInput);

          // Add client code
          const clientCodeInput = document.createElement("input");
          clientCodeInput.type = "hidden";
          clientCodeInput.name = "clientCode";
          clientCodeInput.value = response.data.clientCode;
          form.appendChild(clientCodeInput);
          document.body.appendChild(form);
          form.submit();

          if (autofillDataId) {
            await fetch(
              `${import.meta.env.VITE_BACKEND_API}/mark-data-processed`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dataId: autofillDataId }),
              }
            );
          }
        } else {
          setGeneralError("Failed to initiate payment. Please try again.");
          setLoading(false);
        }
      } else if (gateway === "airpay") {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/airpay/create-payment`,
          {
            amount: Number.parseFloat(formData.amount),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            order_id: orderId,
          }
        );
        if (response.data.success) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = response.data.paymentUrl;

          // Add all Airpay required fields
          const paymentData = response.data.paymentData;

          Object.keys(paymentData).forEach((key) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();

          if (autofillDataId) {
            await fetch(
              `${import.meta.env.VITE_BACKEND_API}/mark-data-processed`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dataId: autofillDataId }),
              }
            );
          }
        } else {
          setGeneralError("Failed to initiate payment. Please try again.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setGeneralError("Failed to initiate payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-black">
          Request {decodedService}
        </h2>

        {generalError && (
          <div
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {generalError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              className={`w-full border ${
                errors.amount ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
            />
            {errors.amount && (
              <p id="amount-error" className="text-red-500 text-sm mt-1">
                {errors.amount}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your first name"
              className={`w-full border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={handleLastNameChange}
              placeholder="Enter your last name"
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone Number *
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={`w-full border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
            aria-busy={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-300 text-black py-3 rounded-md font-semibold hover:bg-gray-400 transition mt-2"
            disabled={loading}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
