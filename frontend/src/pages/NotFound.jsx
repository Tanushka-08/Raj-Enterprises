import React from 'react';
import { Link } from 'react-router-dom';
import { FiDroplet } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="page-enter-active min-vh-100 d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 py-5">
      <div className="container text-center py-5">
        <FiDroplet size={64} className="text-accent mb-4 opacity-75" />
        <h1 className="display-1 fw-bold text-gradient mb-2">404</h1>
        <h3 className="fw-bold mb-3">Page Not Found</h3>
        <p className="lead text-muted mb-4">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/" className="btn btn-primary btn-lg rounded-pill px-4">Back to Home</Link>
          <Link to="/contact" className="btn btn-outline-primary btn-lg rounded-pill px-4 bg-card">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
