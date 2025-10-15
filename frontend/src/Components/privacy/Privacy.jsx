import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, Users, FileText, CheckCircle } from 'lucide-react';

export default function Privacy() {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: FileText,
      content: `We collect information from our visitors and clients to improve our services and enhance user experience. This includes information necessary for business communication, service delivery, and legal compliance. We may collect details such as your name, email address, contact number, company name, job title, and project requirements when you fill out our contact forms, request a quotation, or inquire about our services.

Additionally, we automatically collect certain technical information such as your Internet Protocol (IP) address, browser type, device information, geographic location, referral URLs, and time of access to help us understand how our website is used and to improve its functionality and performance.

We may also gather data using cookies and tracking technologies that record user interactions, preferences, and browsing patterns. This helps us provide a customized experience for our users and clients. Cookies are small text files stored on your device, which you can disable at any time through your browser settings. However, disabling cookies may limit some functionalities of our website.`
    },
    {
      id: 'provide',
      title: 'Information You Provide to Us',
      icon: Users,
      content: `When you communicate with us through our website, email, or social media platforms, we may ask for personal and business information such as your full name, email ID, mobile number, business name, country, and service requirements. If you purchase any service or product directly through our website, you may be required to provide payment details, which are securely processed through our authorized payment gateway partners.

Regenta International does not store or retain any credit or debit card details on its servers. All payment transactions are handled with secure encryption through third-party payment processors that comply with data security standards.

We may also collect communication records, project files, proposals, or correspondence exchanged during project discussions to better understand your needs and provide relevant solutions. All such information is handled with strict confidentiality.`
    },
    {
      id: 'usage',
      title: 'Information from Service Usage',
      icon: Eye,
      content: `We automatically collect technical information when you interact with our website or digital services. This includes log data such as browser type, operating system, IP address, device identifiers, referring URLs, and the date and time of your visit.

This data helps us understand how our website is being accessed, identify usage trends, and detect technical issues to maintain a secure and efficient online experience. Such information is primarily used for analytics, system improvement, and security monitoring purposes.`
    },
    {
      id: 'thirdparty',
      title: 'Information from Third-Party Platforms',
      icon: Users,
      content: `Regenta International maintains official profiles on social media and digital marketing platforms including Facebook, LinkedIn, Instagram, X (Twitter), and YouTube. When you interact with us through these platforms—such as liking, following, commenting, or messaging—we may collect publicly available information including your profile name, username, and any other details visible based on your privacy settings.

We use this data to engage with our audience, respond to inquiries, and improve communication strategies. Our marketing team may also collect publicly available business information from professional networks or directories after you have contacted us to ensure we can tailor our services to your business needs.`
    },
    {
      id: 'use',
      title: 'How We Use the Collected Information',
      icon: CheckCircle,
      content: `The information collected by Regenta International is used to deliver, enhance, and personalize our services. We use your contact information to respond to your inquiries, provide project estimates, send proposals, or offer support. Our business development team may use your data to understand your business requirements and recommend suitable digital solutions.

We also use the collected data for internal review, record-keeping, analytics, and service improvement purposes. Additionally, we may use your email address to send updates about our services, newsletters, marketing promotions, or event notifications that we believe could be beneficial to your business.

You may opt out of these communications at any time by clicking the "unsubscribe" link in our emails or by contacting us directly at info@regentainternational.in. Your data also enables us to generate invoices, payment confirmations, and other transactional communications necessary for business operations. We do not sell, trade, or rent personal information to any external third-party organization.`
    },
    {
      id: 'sharing',
      title: 'Sharing of Information',
      icon: Users,
      content: `Regenta International respects the confidentiality of all client information. We do not share your data with unrelated third parties except under specific circumstances. Your data may be shared with our subsidiary companies, partner agencies, or affiliates for the purpose of service delivery, marketing coordination, or technical support.

Additionally, we may share limited data with trusted third-party service providers such as cloud hosting platforms, CRM tools, or marketing automation partners who assist us in maintaining and improving our operations. All such partners are bound by confidentiality agreements and data protection obligations.

We may also share your information if required by law, court order, or government regulation, or if necessary to protect the legal rights, property, or safety of Regenta International, its clients, or employees.`
    },
    {
      id: 'rights',
      title: 'Your Rights and Choices',
      icon: CheckCircle,
      content: `You have full control over your personal data shared with Regenta International. You have the right to access, correct, update, or request deletion of your personal information at any time. If you wish to opt out of receiving marketing or promotional communications, you can click the unsubscribe link provided in our emails or send a request to info@regentainternational.in with the subject "Opt-Out."

You may also request details about the data we hold about you, restrict its processing, or withdraw consent for its use where applicable. We will comply with such requests in accordance with applicable data protection laws, provided there are no legal or contractual obligations that require us to retain the data.`
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: Lock,
      content: `The security of your personal data is our top priority. We implement appropriate technical and organizational measures to protect your information from unauthorized access, alteration, disclosure, or destruction. Our systems are safeguarded using firewalls, encryption technologies, and access control protocols.

Sensitive data transmitted through our website is protected using Secure Socket Layer (SSL) encryption. We also ensure that only authorized personnel who require access to your data for legitimate business purposes are granted such permissions.

While we follow industry best practices to protect your data, no online system can guarantee absolute security. Therefore, you acknowledge that the transmission of information over the internet carries inherent risks.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 sm:w-20 sm:h-20" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4">
            Privacy Policy
          </h1>
          <p className="text-blue-100 text-center text-lg sm:text-xl max-w-3xl mx-auto">
            Regenta International is committed to protecting your privacy and personal information
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Effective Date: 14-10-2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <a href="mailto:info@regentainternational.in" className="hover:text-blue-200 transition-colors">
                info@regentainternational.in
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 mb-8 border-l-4 border-blue-600">
          <p className="text-gray-700 leading-relaxed mb-4">
            This Privacy Policy applies to all visitors, users, and clients of Regenta International ("Regenta," "we," "us," or "our") and governs how we collect, use, store, and protect personal information across all our websites, applications, and online services. By using our website or engaging with any of our services, you agree to the terms outlined in this Privacy Policy.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Regenta International provides a range of IT and digital solutions, including website and mobile application development, social media management, graphic design, branding, and digital marketing services. This policy describes how we handle personal data collected through our website, client interactions, and digital communication platforms.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <button
                  onClick={() => setActiveSection(isActive ? null : section.id)}
                  className="w-full px-6 sm:px-8 py-6 flex items-start gap-4 text-left hover:bg-blue-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                      {section.title}
                    </h2>
                    <p className="text-blue-600 text-sm">Click to {isActive ? 'collapse' : 'expand'}</p>
                  </div>
                </button>
                
                {isActive && (
                  <div className="px-6 sm:px-8 pb-6 animate-fadeIn">
                    <div className="pl-0 sm:pl-16">
                      {section.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Data Retention</h3>
            <p className="text-blue-100 leading-relaxed">
              We retain personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer required, it is securely deleted or anonymized from our records.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Children's Privacy</h3>
            <p className="text-blue-100 leading-relaxed">
              Our website and services are not directed towards individuals under the age of 16. Regenta International does not knowingly collect personal data from minors. If we become aware that we have inadvertently received such information, we will take immediate steps to delete it from our systems.
            </p>
          </div>
        </div>

        {/* Policy Updates */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-8 border-t-4 border-blue-600">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h3>
          <p className="text-gray-700 leading-relaxed">
            Regenta International reserves the right to modify or update this Privacy Policy at any time without prior notice. Any revisions will be published on our website with an updated "Effective Date." We encourage you to review this policy periodically to stay informed about how we protect your information.
          </p>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 sm:p-10 mt-8 text-white text-center">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Contact Us</h3>
          <p className="text-blue-100 leading-relaxed mb-6 max-w-2xl mx-auto">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
          </p>
          <a
            href="mailto:info@regentainternational.in"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors text-lg"
          >
            <Mail className="w-5 h-5" />
            info@regentainternational.in
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8 px-4 text-center mt-16">
        <p>© 2025 Regenta International. All rights reserved.</p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}