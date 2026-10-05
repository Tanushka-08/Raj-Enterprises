import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiArrowUp, FiLock } from 'react-icons/fi';
import { scrollToTop } from '../utils/helpers';

const Footer = () => {
  return (
    <footer className="footer position-relative mt-5">
      {/* SVG Wave */}
      <div style={{ position: 'absolute', top: '-1px', left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, transform: 'rotate(180deg)' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ display: 'block', width: 'calc(100% + 1.3px)', height: '40px' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style={{ fill: 'var(--bg-primary)' }}></path>
        </svg>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h4 className="fw-bold text-primary mb-3">Raj Enterprises</h4>
            <p className="footer-text footer-tagline mb-3" lang="mr">शुद्ध पाणी</p>
            <p className="footer-text footer-tagline mb-3" lang="hi">भरोसा पक्का</p>
            <p className="footer-text mb-4">Complete RO solutions for modern Navi Mumbai homes.</p>
            <p className="footer-text small">Premium domestic RO water purification services in Navi Mumbai. We offer sales, installation, repair, and AMC services.</p>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled footer-text">
              <li className="mb-2"><Link to="/about">About Us</Link></li>
              <li className="mb-2"><Link to="/products">Products</Link></li>
              <li className="mb-2"><Link to="/amc">AMC Plans</Link></li>
              <li className="mb-2"><Link to="/contact">Contact Us</Link></li>
              <li className="mb-2"><Link to="/track-service">Track Service</Link></li>
              <li className="mb-2">
                <Link to="/admin/login" className="footer-admin-link">
                  <FiLock size={13} className="me-1" /> Admin Login
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Services</h5>
            <ul className="list-unstyled footer-text">
              <li className="mb-2"><Link to="/book-service">RO Installation</Link></li>
              <li className="mb-2"><Link to="/book-service">RO Repair</Link></li>
              <li className="mb-2"><Link to="/book-service">Filter Replacement</Link></li>
              <li className="mb-2"><Link to="/track-service">Track Service</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold mb-3">Contact Info</h5>
            <ul className="list-unstyled footer-text">
              <li className="mb-3 d-flex align-items-start">
                <FiMapPin className="text-accent me-2 mt-1 flex-shrink-0" />
                <span>Service Area:<br/>Navi Mumbai</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FiPhone className="text-accent me-2 flex-shrink-0" />
                <a href="tel:8237739994" className="text-decoration-none">8237739994</a>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FiMail className="text-accent me-2 flex-shrink-0" />
                <a href="mailto:aquarajenterprises@gmail.com" className="text-decoration-none">aquarajenterprises@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-top border-secondary py-3 text-center">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-0 text-muted small">© {new Date().getFullYear()} Raj Enterprises. All Rights Reserved.</p>
          <button onClick={scrollToTop} className="btn btn-sm btn-primary rounded-circle mt-3 mt-md-0" aria-label="Back to top">
            <FiArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
