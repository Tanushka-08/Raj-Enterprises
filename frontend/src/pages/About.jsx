import React from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { FiCheckCircle, FiHeart, FiShield, FiTrendingUp } from 'react-icons/fi';

const About = () => {
  return (
    <div className="page-enter-active">
      {/* Hero */}
      <section className="py-5 bg-secondary bg-opacity-10 text-center border-bottom">
        <div className="container py-5 mt-4">
          <h1 className="display-4 fw-bold mb-3 text-gradient">About Raj Enterprises</h1>
          <p className="lead text-muted max-w-700 mx-auto">
            Your trusted partner for pure, safe, and healthy drinking water in Navi Mumbai.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <ScrollReveal direction="left">
                <h2 className="fw-bold mb-4">Who We Are</h2>
                <p className="text-secondary mb-3">
                  Raj Enterprises is a premier domestic RO water purifier service provider based in Navi Mumbai. We specialize in the sales, installation, repair, servicing, and AMC (Annual Maintenance Contract) of top-quality water purifiers.
                </p>
                <p className="text-secondary mb-4">
                  With years of experience in the industry, we understand the importance of clean drinking water for your family's health. That's why we operate with the motto <strong>"Shuddha Paani, Bharosa Pakka"</strong>, ensuring that every service we deliver meets the highest standards of quality and reliability.
                </p>
                <div className="bg-primary bg-opacity-10 p-4 rounded-4 border border-primary border-opacity-25">
                  <h5 className="fw-bold text-primary mb-2">Our Mission</h5>
                  <p className="mb-0 text-dark">To provide pure, safe, and healthy drinking water to every home in Navi Mumbai through reliable products and prompt service.</p>
                </div>
              </ScrollReveal>
            </div>
            <div className="col-lg-6">
              <ScrollReveal direction="right">
                <div className="row g-4">
                  {[
                    { icon: FiCheckCircle, title: 'Quality', desc: 'Uncompromising standard in every spare part and service.' },
                    { icon: FiShield, title: 'Trust', desc: 'Transparent pricing and honest recommendations.' },
                    { icon: FiHeart, title: 'Customer First', desc: 'Dedicated support and priority service for AMC customers.' },
                    { icon: FiTrendingUp, title: 'Affordability', desc: 'Competitive pricing without sacrificing quality.' }
                  ].map((val, idx) => (
                    <div key={idx} className="col-sm-6">
                      <div className="bg-card p-4 rounded-4 shadow-sm border h-100">
                        <val.icon className="text-accent mb-3" size={32} />
                        <h5 className="fw-bold mb-2">{val.title}</h5>
                        <p className="text-muted small mb-0">{val.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-card border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Service Area</h2>
            <p className="text-muted">Proudly serving the community across Navi Mumbai.</p>
          </div>
          <div className="rounded-4 overflow-hidden shadow-sm border position-relative" style={{ height: '400px' }}>
            <iframe
              title="Raj Enterprises service area — Navi Mumbai"
              src="https://www.google.com/maps?q=Navi%20Mumbai%2C%20Maharashtra&z=11&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <p className="text-center text-muted small mt-3 mb-0">
            We provide RO services across Navi Mumbai.{' '}
            <a
              href="https://www.google.com/maps/search/?api=1&query=Navi+Mumbai"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
