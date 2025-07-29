/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Users,
  Clock,
  FileText,
  AlertTriangle,
  Award,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const PolicySection = ({
    id,
    title,
    icon: Icon,
    children,
    defaultExpanded = false,
  }) => {
    const isExpanded =
      expandedSections[id] !== undefined
        ? expandedSections[id]
        : defaultExpanded;

    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <Icon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="pt-4 text-gray-700 leading-relaxed">{children}</div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* Go Back Button */}
          <Link
            to="/"
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Go Back</span>
          </Link>

          {/* Centered Content */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Company Policy Norms
            </h1>
            <p className="text-xl text-gray-600 mb-4">Regenta International</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome to Regenta International
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            As a growing IT Company, we are committed to fostering an
            innovative, inclusive, professional and secure work environment.
            This document outlines our key policies, expectations, and best
            practices to guide our employees and stakeholders. The following
            policies define the terms that govern our relationship with
            employees, clients and partners. By engaging with us, you
            acknowledge and agree to abide by these policies.
          </p>
        </div>

        {/* Company Values */}
        <PolicySection
          id="values"
          title="Company Values"
          icon={Award}
          defaultExpanded={true}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Innovation</h4>
              <p className="text-sm text-blue-700">
                Encouraging creativity and forward-thinking solutions.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Integrity</h4>
              <p className="text-sm text-green-700">
                Upholding honesty and ethical behavior in all our dealings.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">
                Collaboration
              </h4>
              <p className="text-sm text-purple-700">
                Promoting teamwork and open communication.
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">
                Customer-Centricity
              </h4>
              <p className="text-sm text-orange-700">
                Prioritizing customer satisfaction and experience.
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2">
                Growth & Learning
              </h4>
              <p className="text-sm text-indigo-700">
                Supporting continuous personal and professional development.
              </p>
            </div>
          </div>
        </PolicySection>

        {/* Employment Policies */}
        <PolicySection id="employment" title="Employment Policies" icon={Users}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                2.1 Recruitment & Onboarding
              </h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  Regenta International hires based on merit, skills, and
                  cultural fit
                </li>
                <li>
                  Equal opportunity employer, ensuring no discrimination based
                  on race, gender, religion, or other factors
                </li>
                <li>
                  New employees undergo an onboarding process covering company
                  policies, job roles, and expectations
                </li>
                <li>
                  All intellectual property created during employment or
                  contractual work with Regenta International is the sole
                  property of the company
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                2.2 Work Hours
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Standard work hours:</strong> 9:00 AM – 6:00 PM,
                  Monday to Saturday (8:00hrs Working, 1hr Lunch)
                </p>
                <p className="text-gray-700 mt-2">
                  Flexible working arrangements may be available based on role
                  and performance.
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                2.3 Payment & Compensation Policy
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">
                    Employee Payments
                  </h5>
                  <p className="text-sm text-green-700">
                    Salaries are credited on the 10th of every month or the next
                    working day in case of public holidays.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">
                    Client Payments
                  </h5>
                  <p className="text-sm text-blue-700">
                    Payments must align with contract terms and be cleared
                    within 30 days of invoice issuance.
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-medium text-red-800 mb-2">
                    Late Payments
                  </h5>
                  <p className="text-sm text-red-700">
                    A penalty of 1.5% per month is applicable for overdue client
                    payments.
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-2">
                    Refund Policy
                  </h5>
                  <p className="text-sm text-yellow-700">
                    Switch between previous services in different IT domains for
                    the same service amount. Processed within 15 business days.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                2.4 Leave & Attendance Policy
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-800">
                        Leave Type
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-800">
                        Entitlement
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-800">
                        Requirements
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Casual Leave
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        1 paid monthly leave
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Accrued proportionally
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        Sick Leave
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Up to 6 days per year
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Medical certificate for 2 days
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">
                        Unpaid Leave
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        As applicable
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Without prior information
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        Maternity/Paternity
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        As per labor laws
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        Documentation required
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-800 text-sm">
                  <strong>Important:</strong> Consecutive absence of more than 3
                  working days may lead to legal action by the company.
                </p>
              </div>
            </div>
          </div>
        </PolicySection>

        {/* Code of Conduct */}
        <PolicySection id="conduct" title="Code of Conduct" icon={Shield}>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                3.1 Workplace Ethics
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-gray-700">
                  • Respect for colleagues, clients, and company assets
                </p>
                <p className="text-gray-700">
                  • Zero tolerance for harassment, discrimination, or bullying
                </p>
                <p className="text-gray-700">
                  • Anti-harassment laws: Indian Penal Code (IPC) and Sexual
                  Harassment of Women at Workplace Act, 2013
                </p>
                <p className="text-gray-700">
                  • Ethical handling of company and client data
                </p>
                <p className="text-gray-700">
                  • Business casual attire required; formal attire for client
                  interactions
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                3.2 Confidentiality & Data Security
              </h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 mb-2">
                  <strong>Key Requirements:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                  <li>
                    Maintain confidentiality of company trade secrets and client
                    information
                  </li>
                  <li>
                    Compliance with India's IT Act of 2000 and global data
                    protection regulations
                  </li>
                  <li>
                    All intellectual property belongs to Regenta International.
                  </li>
                  <li>Mandatory Non-Disclosure Agreement (NDA)</li>
                  <li>Unauthorized sharing may result in legal action</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">
                3.3 Conflict of Interest
              </h4>
              <p className="text-gray-700">
                Employees must disclose any personal or financial interest that
                could impact their professional responsibilities.
              </p>
            </div>
          </div>
        </PolicySection>

        {/* Remote Work Policy */}
        <PolicySection
          id="remote"
          title="Remote Work & Hybrid Policy"
          icon={Clock}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-4">
              Hybrid Work Guidelines
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">
                  Expectations:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Maintain productivity while working remotely</li>
                  <li>Effective communication required</li>
                  <li>Accessible during core hours</li>
                  <li>Use designated communication tools</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">
                  Security Requirements:
                </h5>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Use company-provided VPNs</li>
                  <li>Secure tools mandatory</li>
                  <li>Maintain cybersecurity protocols</li>
                  <li>Balance productivity and flexibility</li>
                </ul>
              </div>
            </div>
          </div>
        </PolicySection>

        {/* Additional Policies */}
        <PolicySection
          id="additional"
          title="Additional Policies"
          icon={FileText}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Performance & Growth
                </h4>
                <p className="text-sm text-gray-700">
                  Regular performance reviews, learning programs, and career
                  advancement opportunities based on merit.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  IT & Internet Usage
                </h4>
                <p className="text-sm text-gray-700">
                  Responsible use of company devices and internet. Unauthorized
                  downloads prohibited.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Anti-Bribery Policy
                </h4>
                <p className="text-sm text-gray-700">
                  Zero tolerance for bribery. Violations lead to dismissal and
                  legal action.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Dispute Resolution
                </h4>
                <p className="text-sm text-gray-700">
                  First resolved through HR, then arbitration under Arbitration
                  and Conciliation Act of 1996.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Health & Safety
                </h4>
                <p className="text-sm text-gray-700">
                  Follow workplace safety protocols and emergency procedures at
                  all times.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Termination Policy
                </h4>
                <p className="text-sm text-gray-700">
                  30-day notice for voluntary termination. Company assets must
                  be returned.
                </p>
              </div>
            </div>
          </div>
        </PolicySection>

        {/* Policy Updates */}
        <div className="bg-gray-800 text-white rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">
            Policy Updates & Amendments
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            By engaging with Regenta International, you agree to comply with
            these policies. We reserve the right to update these terms as
            required by evolving business or legal needs. Employees will be
            notified of any changes in a timely manner.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2024 Regenta International. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Privacy;
