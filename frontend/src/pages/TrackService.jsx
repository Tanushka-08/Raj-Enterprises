import React from 'react';
import TicketTracker from '../components/TicketTracker';
import { FiLifeBuoy } from 'react-icons/fi';
import { generateCallLink, BUSINESS_PHONE } from '../utils/helpers';

const TrackService = () => {
  return (
    <div className="page-enter-active">
      <section className="page-hero">
        <div className="container py-4">
          <span className="section-eyebrow">Service status</span>
          <h1 className="display-4 fw-bold mb-2">Track Service Status</h1>
          <p className="lead text-muted mb-0">Enter your Ticket ID and registered mobile number to see live progress.</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <TicketTracker />

              <div className="mt-5 text-center p-4 premium-panel">
                <FiLifeBuoy size={32} className="text-accent mb-3" />
                <h5 className="fw-bold">Facing issues with your ticket?</h5>
                <p className="text-secondary mb-3">If you haven't received an update or can't find your ticket, please reach out to us directly.</p>
                <a href={generateCallLink(BUSINESS_PHONE)} className="btn btn-primary rounded-pill px-4">Call Customer Support</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrackService;
