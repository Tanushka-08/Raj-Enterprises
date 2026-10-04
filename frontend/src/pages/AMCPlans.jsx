import React, { useState, useEffect } from 'react';
import AMCPlanCard from '../components/AMCPlanCard';
import AMCCalculator from '../components/AMCCalculator';
import ScrollReveal from '../components/ScrollReveal';
import { apiService } from '../services/api';

// Offline fallback (mirrors backend seed) used only when the API/DB is unreachable
const fallbackPlans = [
  {
    _id: 'fallback-basic',
    name: 'Domestic Basic AMC',
    type: 'basic',
    price: 2499,
    duration: '1 Year',
    features: ['2 Scheduled Service Visits', 'Basic Filter Cleaning', 'Filter Health Check', 'Water Quality Testing', 'Phone Support'],
    filterReplacement: false
  },
  {
    _id: 'fallback-premium',
    name: 'Domestic Premium AMC',
    type: 'premium',
    price: 4999,
    duration: '1 Year',
    features: ['4 Scheduled Service Visits', 'Filter Replacements (Sediment + Pre-Carbon + Post-Carbon)', 'Priority Same-Day Support', 'Annual Comprehensive Health Check', 'Water Quality Testing', 'Emergency Visit Coverage', '10% Discount on Additional Parts'],
    filterReplacement: true
  }
];

const AMCPlans = () => {
  const [plans, setPlans] = useState([]);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadPlans = async () => {
      try {
        const data = await apiService.getAMCPlans();
        const list = Array.isArray(data) ? data : [];
        if (!cancelled) {
          if (list.length) setPlans(list);
          else { setPlans(fallbackPlans); setUsingFallback(true); }
        }
      } catch (err) {
        if (!cancelled) { setPlans(fallbackPlans); setUsingFallback(true); }
      }
    };
    loadPlans();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page-enter-active">
      <section className="py-5 bg-secondary bg-opacity-10 text-center border-bottom">
        <div className="container py-5 mt-4">
          <h1 className="display-4 fw-bold mb-3 text-gradient">Annual Maintenance Contracts</h1>
          <p className="lead text-muted max-w-700 mx-auto">
            Enjoy peace of mind with our comprehensive AMC plans for your RO water purifier.
          </p>
        </div>
      </section>

      <section className="py-5 mt-3">
        <div className="container">
          {usingFallback && (
            <div className="alert alert-warning small text-center">
              Live AMC pricing is temporarily unavailable. Showing indicative plans — please confirm current pricing by phone.
            </div>
          )}
          <div className="row justify-content-center g-4 mb-5">
            {plans.map((plan, idx) => (
              <div key={plan._id || idx} className="col-md-6 col-lg-5">
                <ScrollReveal delay={idx * 0.2}>
                  <AMCPlanCard plan={plan} />
                </ScrollReveal>
              </div>
            ))}
          </div>

          {plans.length > 0 && (
            <div className="row justify-content-center mt-5 pt-5 border-top">
              <div className="col-lg-8">
                <ScrollReveal direction="up">
                  <AMCCalculator plans={plans} />
                </ScrollReveal>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5 bg-card">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Get an AMC?</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'Cost Savings', desc: 'Prevent expensive major repairs with regular preventive maintenance.' },
              { title: 'Optimal Health', desc: 'Timely filter changes ensure you always drink 100% pure water.' },
              { title: 'Longer Lifespan', desc: 'Regular servicing significantly increases the life of your purifier.' },
              { title: 'Priority Service', desc: 'AMC customers get immediate response and quick resolution.' }
            ].map((benefit, idx) => (
              <div key={idx} className="col-md-3 text-center">
                <div className="bg-secondary bg-opacity-10 p-4 rounded-4 h-100">
                  <h5 className="fw-bold mb-2">{benefit.title}</h5>
                  <p className="text-muted small mb-0">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AMCPlans;
