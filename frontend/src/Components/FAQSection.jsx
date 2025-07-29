import React, { useState } from "react";
import whyImage from "../assets/girl.png"; 

const faqs = [
  {
    question: "How does RegentaInternational ensure the security of its software solutions?",
    answer:
      "We implement advanced security protocols, encryption, and regular audits to safeguard all applications.",
  },
  {
    question: "Can RegentaInternational customize its software solutions to fit our specific needs?",
    answer:
      "Yes, all our solutions are highly customizable to meet your unique business requirements.",
  },
  {
    question: "What industries does RegentaInternational Technologies specialize in serving?",
    answer:
      "We serve industries like healthcare, eCommerce, education, finance, logistics, and more.",
  },
  {
    question: "Can RegentaInternational Technologies accommodate large-scale projects?",
    answer:
      "Absolutely. Our expert team can handle enterprise-level projects with scalability in mind.",
  },
  {
    question: "How does RegentaInternational Technologies ensure the quality of its software solutions?",
    answer:
      "Through rigorous testing, continuous feedback loops, and quality assurance processes.",
  },
  {
    question: "Can RegentaInternational Technologies integrate its software solutions with existing systems?",
    answer:
      "Yes, our solutions are designed for seamless integration with your existing infrastructure.",
  },
  {
    question: "What measures does RegentaInternational Technologies take to protect client data?",
    answer:
      "We use strict data protection policies, secure servers, and comply with GDPR and global data standards.",
  },
  {
    question: "How does RegentaInternational Technologies approach project management?",
    answer:
      "We follow agile methodologies for efficient and transparent project management.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Find answers to common queries about RegentaInternational Technologies and our services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {}
          <div className="relative">
            <img
              src={whyImage}
              alt="FAQ"
              className="rounded-2xl w-full h-auto object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-white shadow-lg rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 text-lg">15+ Industries Experts</h4>
              <p className="text-gray-500 text-sm mt-1">
                Experts from diverse industries, delivering tailored solutions for you.
              </p>
            </div>
          </div>

          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left text-gray-800 font-medium hover:bg-gray-50"
                >
                  {faq.question}
                  <span>{openIndex === index ? "-" : "+"}</span>
                </button>
                {openIndex === index && (
                  <div className="px-5 pb-4 text-gray-600 text-sm bg-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;