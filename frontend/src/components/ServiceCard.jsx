import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ServiceCard = ({ service }) => {
  const [ref, isVisible] = useScrollReveal();

  if (!service) return null;
  const Icon = service.icon;

  return (
    <div ref={ref} className={`service-card hover-lift ${isVisible ? 'animate-pop-in' : 'reveal-hidden'}`}>
      <div className="service-icon icon-badge">
        {Icon && <Icon />}
      </div>
      <h4 className="fw-bold mb-3">{service.title}</h4>
      <p className="text-secondary mb-4">{service.description}</p>
      
      <Link 
        to={`/book-service?type=${encodeURIComponent(service.title)}`} 
        className="btn btn-outline-primary rounded-pill d-inline-flex align-items-center mt-auto"
      >
        Book Now <FiArrowRight className="ms-2" />
      </Link>
    </div>
  );
};

export default ServiceCard;
