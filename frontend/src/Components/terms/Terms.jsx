import React, { useEffect } from "react";
import {
  ArrowLeft,
  FileText,
  Clock,
  Building,
  Globe,
  Smartphone,
  Palette,
  Settings,
  Cloud,
  TrendingUp,
  CheckCircle,
  CreditCard,
  Mail,
  Phone,
  Shield,
  Users,
  Scale,
  UserCheck,
  Eye,
  AlertTriangle,
  XCircle,
  Gavel,
  Contact,
} from "lucide-react";

const Terms = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const services = [
    { icon: Globe, name: "Website Development" },
    { icon: Smartphone, name: "Mobile App Development" },
    { icon: Palette, name: "UI/UX Design" },
    { icon: Settings, name: "Software Solutions" },
    { icon: Cloud, name: "Cloud Services" },
    { icon: TrendingUp, name: "Digital Marketing" },
    { icon: Users, name: "Maintenance & Support Services" },
  ];

  const eligibilityRequirements = [
    {
      icon: UserCheck,
      title: "Age Requirement",
      description: "You are at least 18 years old",
    },
    {
      icon: Scale,
      title: "Legal Authority",
      description: "You have legal authority to enter binding agreements",
    },
  ];

  const clientResponsibilities = [
    {
      icon: CheckCircle,
      title: "Accurate Information",
      description:
        "Providing accurate and timely information required to complete services",
    },
    {
      icon: Clock,
      title: "Timely Approvals",
      description:
        "Approving drafts, content, or design within agreed timelines",
    },
    {
      icon: Shield,
      title: "Content Rights",
      description:
        "Ensuring all content provided doesn't infringe on third-party rights",
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
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to{" "}
            <span className="font-semibold text-blue-600">
              Regenta International
            </span>
            . These terms govern your use of our website and services.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            <Clock className="w-4 h-4" />
            Last Updated: January 2025
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">
                Agreement Overview
              </h3>
              <p className="text-blue-700 leading-relaxed">
                These Terms and Conditions ("Terms", "Agreement") govern your
                use of our website{" "}
                <span className="font-medium">regentainternational.in</span> and
                the services we offer, including IT solutions, software
                development, and related services. By accessing or using our
                Website and purchasing our Services, you agree to be bound by
                these Terms.
              </p>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {/* Section 1: Company Information */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                1. Company Information
              </h2>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-4">
                Regenta International
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700">Delhi, India</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a
                    href="mailto:info@regentainternational.in"
                    className="text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    info@regentainternational.in
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <a
                    href="tel:+919311689277"
                    className="text-blue-700 hover:text-blue-800 transition-colors"
                  >
                    +91-9311689277
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Services Offered */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                2. Services Offered
              </h2>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We provide IT and software-related services including, but not
              limited to:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                >
                  <service.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{service.name}</span>
                </div>
              ))}
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm">
                <span className="font-medium">Note:</span> You can purchase our
                services directly through the Website. Details of each service,
                pricing, timelines, and deliverables are provided on the
                respective service page.
              </p>
            </div>
          </div>

          {/* Section 3: Eligibility */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                3. Eligibility
              </h2>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              By using our Website and Services, you confirm that:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eligibilityRequirements.map((requirement, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <requirement.icon className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800">
                      {requirement.title}
                    </h3>
                  </div>
                  <p className="text-green-700 text-sm">
                    {requirement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Payments */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">4. Payments</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All payments must be made in full at the time of purchase,
                unless otherwise agreed upon. We use secure third-party payment
                gateways for processing transactions.
              </p>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-orange-800 text-sm">
                  <span className="font-medium">Important:</span> We reserve the
                  right to change our prices at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Order Confirmation */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                5. Order Confirmation
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Once you place an order, you will receive an email confirmation.
              This does not signify our acceptance of your order. We reserve the
              right to accept or decline any order for any reason.
            </p>
          </div>

          {/* Section 6: Refunds and Cancellations */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                6. Refunds and Cancellations
              </h2>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700">
                Please refer to our{" "}
                <span className="font-semibold">
                  Refund & Cancellation Policy
                </span>{" "}
                for detailed information. Refunds may be issued in accordance
                with the terms defined in that policy, based on service progress
                and delivery status.
              </p>
            </div>
          </div>

          {/* Section 7: Intellectual Property */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                7. Intellectual Property
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                All content, designs, source code, graphics, and materials
                provided by Regenta International remain our intellectual
                property unless otherwise agreed in writing.
              </p>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-purple-800 text-sm">
                  <span className="font-medium">Agreement:</span> You agree not
                  to copy, reproduce, or distribute our proprietary content
                  without our permission.
                </p>
              </div>
            </div>
          </div>

          {/* Section 8: Client Responsibilities */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                8. Client Responsibilities
              </h2>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              You are responsible for:
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {clientResponsibilities.map((responsibility, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <responsibility.icon className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-green-800 text-sm">
                      {responsibility.title}
                    </h3>
                  </div>
                  <p className="text-green-700 text-xs">
                    {responsibility.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 9: Confidentiality */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                9. Confidentiality
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Both parties agree to maintain confidentiality over shared
              sensitive business or personal data, unless required by law or
              with prior written consent.
            </p>
          </div>

          {/* Section 10: Limitation of Liability */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                10. Limitation of Liability
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Regenta International will not be held liable for any indirect,
                incidental, or consequential damages arising from the use of our
                services.
              </p>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-orange-800 text-sm">
                  <span className="font-medium">Maximum Liability:</span> Our
                  maximum liability shall not exceed the total amount paid by
                  you for the services.
                </p>
              </div>
            </div>
          </div>

          {/* Section 11: Termination */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                11. Termination
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to terminate access to our Website or
              Services if we believe that you have violated these Terms.
            </p>
          </div>

          {/* Section 12: Governing Law */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gavel className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                12. Governing Law
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by the laws of India. Any disputes
              arising shall be subject to the jurisdiction of the courts located
              in{" "}
              <span className="font-semibold text-blue-600">Delhi, India</span>.
            </p>
          </div>

          {/* Section 13: Modifications */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                13. Modifications
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time.
              Continued use of the Website after any changes constitutes
              acceptance of those changes.
            </p>
          </div>

          {/* Section 14: Contact Us */}
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Contact className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                14. Contact Us
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
              understood, and agree to be bound by these Terms and Conditions.
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

export default Terms;
