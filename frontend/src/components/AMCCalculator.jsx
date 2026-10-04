import React, { useState, useEffect } from 'react';
import { formatPrice } from '../utils/helpers';

const AMCCalculator = ({ plans = [] }) => {
  const [planId, setPlanId] = useState(plans[0]?._id || '');

  useEffect(() => {
    if (plans.length && !plans.some((p) => p._id === planId)) {
      setPlanId(plans[0]._id);
    }
  }, [plans, planId]);

  const selected = plans.find((p) => p._id === planId) || plans[0];

  if (!selected) {
    return null;
  }

  const total = Number(selected.price) || 0;

  return (
    <div className="glass-panel p-4 p-md-5 rounded-4 shadow-sm border">
      <h3 className="fw-bold mb-4 text-center">Estimate Your Cost</h3>

      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-medium">Select Plan</label>
          <select className="form-select form-select-lg" value={planId} onChange={(e) => setPlanId(e.target.value)}>
            {plans.map((p) => (
              <option key={p._id} value={p._id}>{p.name} ({formatPrice(p.price)})</option>
            ))}
          </select>

          {selected.features?.length > 0 && (
            <ul className="list-unstyled small text-secondary mt-4 mb-0">
              {selected.features.map((feature, idx) => (
                <li key={idx} className="mb-2 d-flex">
                  <span className="text-accent me-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-md-6">
          <div className="bg-secondary bg-opacity-10 p-4 rounded-4 h-100 d-flex flex-column justify-content-center">
            <h5 className="text-muted mb-3">Cost Breakdown</h5>
            <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-dark border-opacity-10">
              <span>{selected.name}</span>
              <span className="fw-medium">{formatPrice(total)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">Duration</span>
              <span className="fw-medium">{selected.duration || '1 Year'}</span>
            </div>
            <div className="d-flex justify-content-between mt-2 align-items-center">
              <span className="fs-5 fw-bold">Total</span>
              <span className="fs-3 fw-bold text-accent">{formatPrice(total)}</span>
            </div>
            {selected.filterReplacement && (
              <small className="text-muted text-end mt-2">*Filter replacements included in this plan</small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMCCalculator;
