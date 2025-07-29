import React, { useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  Clock,
  Users,
  AlertTriangle,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Settings,
  Smartphone,
  Globe,
  Palette,
  Cloud,
  TrendingUp,
  Contact,
} from "lucide-react";

const Return = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const services = [
    { icon: Globe, name: "Website Development" },
    { icon: Smartphone, name: "Mobile App Development" },
    { icon: Settings, name: "Software Solutions" },
    { icon: Palette, name: "UI/UX Design" },
    { icon: Cloud, name: "Maintenance, Hosting, or Cloud Services" },
    { icon: TrendingUp, name: "Digital Marketing Services" },
  ];

  const supportFeatures = [
    {
      icon: CheckCircle,
      title: "Limited Revisions",
      description: "Based on your selected service package",
    },
    {
      icon: Users,
      title: "Technical Support",
      description: "Ongoing support and minor adjustments",
    },
  ];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Go Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Return and Refund Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thank you for choosing{" "}
            <span className="font-semibold text-blue-600">
              Regenta International
            </span>{" "}
            for your IT and software service needs.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            Last Updated: January 2025
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">
                Important Notice
              </h3>
              <p className="text-red-700">
                As a service-based business offering custom IT and software
                solutions, all purchases made are{" "}
                <span className="font-semibold">final and non-refundable</span>.
                By placing an order with us, you acknowledge and agree to the
                terms outlined below.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {/* Section 1: No Refund Policy */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                1. No Refund Policy
              </h2>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Due to the nature of our services — which are tailored,
              time-bound, and labor-intensive — we do{" "}
              <span className="font-semibold text-red-600">
                not offer refunds
              </span>{" "}
              for any services once the payment has been made.
            </p>
            <p className="text-gray-700 mb-4 font-medium">
              This includes, but is not limited to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                >
                  <service.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{service.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Service Agreement */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                2. Service Agreement
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Before initiating any service, we discuss the full scope,
              timeline, deliverables, and cost with the client. Once the work
              begins, the service is considered in progress and{" "}
              <span className="font-semibold text-red-600">non-refundable</span>{" "}
              under all circumstances.
            </p>
          </div>

          {/* Section 3: Revisions & Support */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                3. Revisions & Support
              </h2>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We are committed to client satisfaction. While we do not offer
              refunds, we do provide:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {supportFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <feature.icon className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <span className="font-medium">Important:</span> Please ensure
                your expectations, goals, and requirements are clearly
                communicated before we start the project.
              </p>
            </div>
          </div>

          {/* Section 4: Exceptions */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                4. Exceptions
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              There are <span className="font-semibold">no exceptions</span> to
              the no-refund policy unless required by law. If a duplicate
              payment or technical error occurs, please notify us within{" "}
              <span className="font-semibold text-blue-600">
                3 business days
              </span>
              , and we will review and resolve the issue appropriately.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Contact className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                4. Contact Us
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our No Refund Policy or need
              clarification before placing an order, you can contact us:
            </p>
            <ul className="text-gray-700 leading-relaxed space-y-1">
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@regentainternational.in"
                  className="text-blue-600 hover:underline"
                >
                  info@regentainternational.in
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+919311689277"
                  className="text-blue-600 hover:underline"
                >
                  +91-9311689277
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-gray-600 text-sm">
              By using our services, you acknowledge that you have read,
              understood, and agree to be bound by this Return and Refund
              Policy.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2025 Regenta International. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Return;
