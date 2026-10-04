import React from 'react';
import BookingForm from '../components/BookingForm';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const BookService = () => {
  return (
    <div className="page-enter-active">
      <section className="py-5 bg-secondary bg-opacity-10 text-center border-bottom">
        <div className="container py-4 mt-4">
          <h1 className="display-4 fw-bold mb-2">Book a Service</h1>
          <p className="lead text-muted mb-0">Fast, reliable, and professional RO services.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="row g-5">
            <div className="col-lg-8">
              <div className="bg-card p-4 p-md-5 rounded-4 shadow-sm border">
                <h3 className="fw-bold mb-4">Service Request Form</h3>
                <BookingForm />
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="bg-accent text-on-accent p-4 rounded-4 shadow-sm mb-4">
                <h4 className="fw-bold mb-4">How it works</h4>
                <ul className="list-unstyled mb-0 position-relative">
                  {/* Vertical line */}
                  <div className="position-absolute top-0 bottom-0 start-0 border-start border-light border-2 ms-3 opacity-50"></div>
                  
                  {[
                    'Fill out the form details',
                    'Get your unique Ticket ID',
                    'We assign a technician',
                    'Service delivered at your doorstep'
                  ].map((step, idx) => (
                    <li key={idx} className="d-flex align-items-center mb-4 position-relative z-1">
                      <div className="bg-white text-accent rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm me-3 flex-shrink-0" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>
                        {idx + 1}
                      </div>
                      <span className="fw-medium">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-card p-4 rounded-4 border shadow-sm">
                <h5 className="fw-bold mb-4">Need Help Booking?</h5>
                <ul className="list-unstyled mb-0 text-secondary">
                  <li className="mb-3 d-flex align-items-start">
                    <FiPhone className="text-accent me-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <span className="d-block text-muted small">Call Us</span>
                      <a href="tel:8237739994" className="text-dark fw-medium text-decoration-none">8237739994</a>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <FiMail className="text-accent me-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <span className="d-block text-muted small">Email Us</span>
                      <a href="mailto:aquarajenterprises@gmail.com" className="text-dark fw-medium text-decoration-none">aquarajenterprises@gmail.com</a>
                    </div>
                  </li>
                  <li className="d-flex align-items-start">
                    <FiMapPin className="text-accent me-3 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <span className="d-block text-muted small">Service Area</span>
                      <span className="text-dark fw-medium">Navi Mumbai</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookService;
