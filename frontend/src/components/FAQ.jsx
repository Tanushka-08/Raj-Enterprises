import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQ = () => {
  const faqs = [
    {
      q: "What areas does Raj Enterprises serve?",
      a: "We provide RO water purifier services across Navi Mumbai."
    },
    {
      q: "How do I book a service?",
      a: "You can book through our website, call us at 8237739994, or WhatsApp us."
    },
    {
      q: "What is included in the AMC plans?",
      a: "We offer Basic and Premium AMC plans. Basic includes 2 service visits and filter health checks. Premium includes 4 visits, filter replacements, and priority support."
    },
    {
      q: "Do you provide installation services?",
      a: "Yes, we provide complete RO installation services across Navi Mumbai."
    },
    {
      q: "How can I track my service request?",
      a: "Use your service ticket ID and registered mobile number on our Track Service page."
    },
    {
      q: "What brands do you offer?",
      a: "We offer AROMA, AquaX, AquaS, Nile, Lexpure, Auric, Aqua Innovica, and Purella water purifiers."
    },
    {
      q: "Do you offer warranties?",
      a: "All our products come with a 1 Year Warranty."
    },
    {
      q: "What is the difference between RO and UV purifiers?",
      a: "RO purifiers remove dissolved solids and are best for high TDS water. UV purifiers kill bacteria and are suitable for low TDS (below 500) water."
    }
  ];

  return (
    <div className="accordion" id="faqAccordion">
      {faqs.map((faq, index) => (
        <div className="accordion-item bg-transparent border-start-0 border-end-0 border-top-0 border-bottom border-secondary mb-3 pb-2" key={index}>
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed bg-transparent text-primary fw-medium px-0 shadow-none" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target={`#collapse${index}`} 
              aria-expanded="false" 
              aria-controls={`collapse${index}`}
            >
              {faq.q}
            </button>
          </h2>
          <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
            <div className="accordion-body px-0 text-secondary">
              {faq.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
