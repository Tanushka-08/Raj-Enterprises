import React from 'react';
import TicketTracker from '../components/TicketTracker';
import { FiLifeBuoy } from 'react-icons/fi';

const TrackService = () => {
  return (
    <div className="page-enter-active">
      <section className="py-5 bg-secondary bg-opacity-10 text-center border-bottom">
        <div className="container py-4 mt-4">
          <h1 className="display-4 fw-bold mb-2">Track Service Status</h1>
          <p className="lead text-muted mb-0">Stay updated on your service request progress.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <TicketTracker />
              
              <div className="mt-5 text-center p-4 bg-primary bg-opacity-10 rounded-4 border border-primary border-opacity-25">
                <FiLifeBuoy size={32} className="text-primary mb-3" />
                <h5 className="fw-bold">Facing issues with your ticket?</h5>
                <p className="text-secondary mb-3">If you haven't received an update or can't find your ticket, please reach out to us directly.</p>
                <a href="tel:8237739994" className="btn btn-outline-primary rounded-pill px-4">Call Customer Support</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrackService;
