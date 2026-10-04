import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiShield } from 'react-icons/fi';
import { formatPrice } from '../utils/helpers';

const AMCPlanCard = ({ plan }) => {
  if (!plan) return null;

  const isPremium = plan.name.toLowerCase().includes('premium');

  return (
    <div className={`card h-100 border-0 shadow-sm ${isPremium ? 'border border-2 border-accent' : ''} position-relative rounded-4 overflow-hidden`}>
      {isPremium && (
        <div className="bg-accent text-on-accent text-center py-1 small fw-bold text-uppercase tracking-wider">
          Recommended
        </div>
      )}
      <div className={`card-body p-5 ${isPremium ? 'bg-accent bg-opacity-10' : 'bg-card'}`}>
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle p-3 mb-3 shadow-sm" style={{ width: '60px', height: '60px' }}>
            <FiShield className="fs-3 text-accent" />
          </div>
          <h3 className="fw-bold mb-2">{plan.name}</h3>
          <div className="d-flex justify-content-center align-items-end">
            <h2 className="display-5 fw-bold text-primary mb-0">{formatPrice(plan.price)}</h2>
            <span className="text-muted ms-1 mb-2">/{plan.duration || 'year'}</span>
          </div>
        </div>

        <ul className="list-unstyled mb-4">
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="mb-3 d-flex align-items-start">
              <FiCheck className="text-success mt-1 me-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="d-grid mt-auto">
          <Link 
            to={`/book-service?type=AMC&plan=${encodeURIComponent(plan.name)}`} 
            className={`btn btn-lg rounded-pill ${isPremium ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Choose Plan
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AMCPlanCard;
