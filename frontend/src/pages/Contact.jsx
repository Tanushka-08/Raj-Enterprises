import React from 'react';
import ContactForm from '../components/ContactForm';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';

const Contact = () => {
  return (
    <div className="page-enter-active">
      <section className="py-5 bg-secondary bg-opacity-10 text-center border-bottom">
        <div className="container py-4 mt-4">
          <h1 className="display-4 fw-bold mb-2">Contact Us</h1>
          <p className="lead text-muted mb-0">We're here to help with all your RO water purifier needs.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="row g-5">
            <div className="col-lg-7">
              <ContactForm />
            </div>
            
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-4 h-100">
                <div className="bg-card p-4 rounded-4 border shadow-sm">
                  <h4 className="fw-bold mb-4">Contact Information</h4>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-accent bg-opacity-10 p-3 rounded-circle text-accent me-3">
                      <FiPhone size={24} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Phone / WhatsApp</h6>
                      <a href="tel:8237739994" className="text-secondary text-decoration-none d-block">8237739994</a>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-accent bg-opacity-10 p-3 rounded-circle text-accent me-3">
                      <FiMail size={24} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Email Address</h6>
                      <a href="mailto:aquarajenterprises@gmail.com" className="text-secondary text-decoration-none d-block">aquarajenterprises@gmail.com</a>
                    </div>
                  </div>

                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-accent bg-opacity-10 p-3 rounded-circle text-accent me-3">
                      <FiClock size={24} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Service Requests</h6>
                      <span className="text-secondary d-block">Book online any time<br/>Our team will contact you</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className="bg-accent bg-opacity-10 p-3 rounded-circle text-accent me-3">
                      <FiMapPin size={24} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">Service Area</h6>
                      <span className="text-secondary d-block">Navi Mumbai, Maharashtra</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-4 overflow-hidden shadow-sm border flex-grow-1">
                  <iframe
                    title="Raj Enterprises service area — Navi Mumbai"
                    src="https://www.google.com/maps?q=Navi%20Mumbai%2C%20Maharashtra&z=11&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '300px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Navi+Mumbai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary rounded-pill"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
