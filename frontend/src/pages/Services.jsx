import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import ScrollReveal from '../components/ScrollReveal';
import { FiTool, FiSettings, FiRefreshCw, FiShield, FiFilter, FiDroplet, FiBriefcase, FiActivity } from 'react-icons/fi';

const services = [
  { icon: FiTool, title: 'RO Installation', description: 'Complete installation of domestic RO water purifiers with expert setup and comprehensive testing.' },
  { icon: FiSettings, title: 'RO Repair', description: 'Quick diagnosis and reliable repair of all types of RO purifier issues by trained technicians.' },
  { icon: FiRefreshCw, title: 'RO Servicing', description: 'Regular maintenance and thorough servicing to keep your purifier performing at its best.' },
  { icon: FiShield, title: 'AMC Plans', description: 'Annual Maintenance Contracts for worry-free purifier maintenance all year round.' },
  { icon: FiFilter, title: 'Filter Replacement', description: 'Genuine filter replacements for all brands and models to ensure optimal water quality.' },
  { icon: FiDroplet, title: 'Water Treatment', description: 'Comprehensive water treatment solutions tailored for your home water conditions.' },
  { icon: FiBriefcase, title: 'Commercial RO', description: 'Heavy-duty RO solutions for offices, shops, and commercial establishments.' },
  { icon: FiActivity, title: 'Water Testing', description: 'Professional water quality testing and TDS analysis to recommend the right purifier.' }
];

const Services = () => {
  return (
    <div className="page-enter-active">
      <section className="py-5 bg-secondary bg-opacity-10 text-center border-bottom">
        <div className="container py-5 mt-4">
          <h1 className="display-4 fw-bold mb-3 text-gradient">Our Services</h1>
          <p className="lead text-muted max-w-700 mx-auto">
            Professional water purification services tailored to your needs in Navi Mumbai.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4 mb-5">
            {services.map((service, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <ScrollReveal direction="up">
            <div className="bg-accent text-on-accent p-5 rounded-4 shadow-lg text-center mt-5 position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-black opacity-10"></div>
              <div className="position-relative z-1">
                <h2 className="fw-bold mb-3">Need Immediate Assistance?</h2>
                <p className="lead mb-4 opacity-75">Our expert technicians are just a call away for any RO emergency.</p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Link to="/book-service" className="btn btn-light btn-lg rounded-pill px-5 text-accent fw-bold">Book a Service Now</Link>
                  <a href="tel:8237739994" className="btn btn-outline-light btn-lg rounded-pill px-5">Call 8237739994</a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Services;
