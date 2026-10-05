import React from 'react';
import { FiClipboard } from 'react-icons/fi';
import BookingForm, { BookingAside } from '../components/BookingForm';
import ScrollReveal from '../components/ScrollReveal';

const BookService = () => {
  return (
    <div className="page-enter-active">
      <section className="page-hero">
        <div className="container py-4">
          <span className="section-eyebrow">Service request</span>
          <h1 className="display-4 fw-bold mb-2">Book a Service</h1>
          <p className="lead text-muted mb-0">Fast, reliable and professional RO services across Navi Mumbai.</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="booking-layout">
            <div className="booking-panel">
              <div className="booking-panel-head">
                <span className="booking-panel-icon"><FiClipboard size={22} /></span>
                <div>
                  <h2 className="h5 fw-bold mb-1">Service Request Form</h2>
                  <p className="text-muted small mb-0">
                    Takes under a minute. You get a Ticket ID immediately — no payment, no OTP.
                  </p>
                </div>
              </div>
              <BookingForm />
            </div>

            <ScrollReveal direction="right">
              <BookingAside />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookService;
