import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ScrollReveal from '../components/ScrollReveal';
import ServiceCard from '../components/ServiceCard';
import ProductCard from '../components/ProductCard';
import ReviewSection from '../components/ReviewSection';
import FAQ from '../components/FAQ';
import { FiCheckCircle, FiTool, FiClock, FiShield, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { apiService } from '../services/api';
import { mapProduct } from '../utils/helpers';

// Offline fallback used only when the API/DB is unreachable
const fallbackFeatured = [
  { id: '1', name: 'Aqua Innovica', brand: 'Aqua Innovica', price: 15999, mrp: 19999, category: 'domestic-ro', technology: '3-in-1 Zinc + Copper + Alkaline', storageCapacity: '9L', shortDesc: 'Compact 9L premium purifier with advanced filtration.', specs: { filtrationStages: 8, warranty: '1 Year Warranty' }, features: ['Compact Design', '9 Litre Storage'], variants: [{ colorCode: '#7986cb', colorName: 'Blue Lavender', image: '/images/products/9e33eada-a2e3-42d2-b26d-e37f9d642c59.jfif' }] },
  { id: '2', name: 'AquaX Swift', brand: 'AquaX Series', price: 16999, mrp: 21999, category: 'domestic-ro', technology: 'RO + 3-in-1 Zinc/Copper/Alkaline', storageCapacity: '15L', shortDesc: 'Premium purifier with 3-in-1 protection.', specs: { filtrationStages: 12, warranty: '1 Year Warranty' }, features: ['3-in-1 Protection', 'Transparent Top Design'], variants: [{ colorCode: '#2d1810', colorName: 'Black & Copper', image: '/images/products/1fc212e0-6eb4-4395-97ad-fac0cefe7ad6.jfif' }] },
  { id: '3', name: 'Purella', brand: 'Purella', price: 7999, mrp: 10999, category: 'uv-purifier', technology: 'UV Purification', storageCapacity: 'Tankless (Inline)', shortDesc: '3-stage UV system for low-TDS water.', specs: { filtrationStages: 3, warranty: '1 Year Warranty' }, features: ['UV Purification', '5L/min Flow Rate'], variants: [{ colorCode: '#37474f', colorName: 'Black & Silver', image: '/images/products/WhatsApp Image 2026-10-02 at 3.05.14 PM.jpeg' }] }
];

// Small uppercase label used above every section heading
const SectionHead = ({ eyebrow, title, subtitle, align = 'center' }) => (
  <div className={`section-head text-${align}`}>
    <span className="section-eyebrow">{eyebrow}</span>
    <h2 className="fw-bold heading-underline is-in mb-0">{title}</h2>
    {subtitle && <p className="text-muted mb-0 mt-2">{subtitle}</p>}
  </div>
);

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const loadFeatured = async () => {
      try {
        const data = await apiService.getProducts({ limit: 4 });
        const list = (data?.products || []).map(mapProduct);
        if (!cancelled) setProducts(list.length ? list.slice(0, 4) : fallbackFeatured);
      } catch (err) {
        if (!cancelled) setProducts(fallbackFeatured);
      }
    };
    loadFeatured();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="page-enter-active">
      <HeroSection />

      {/* Trust strip — factual claims only */}
      <section className="trust-strip" aria-label="Why families trust Raj Enterprises">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { icon: FiShield, text: '1 Year Warranty' },
              { icon: FiMapPin, text: 'Service Area: Navi Mumbai' },
              { icon: FiTool, text: 'Installation, Repair & Servicing' },
              { icon: FiCheckCircle, text: 'AMC Plans Available' }
            ].map((item, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <ScrollReveal delay={idx * 0.08}>
                  <div className="trust-strip-item h-100">
                    <item.icon size={26} className="mb-2" />
                    <p className="mb-0 fw-medium">{item.text}</p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-pad">
        <div className="container">
          <ScrollReveal>
            <SectionHead
              eyebrow="Why Raj Enterprises"
              title="Why Choose Us?"
              subtitle="Domestic RO water purification experts serving Navi Mumbai."
            />
          </ScrollReveal>
          <div className="row g-4 mt-1">
            {[
              { icon: FiTool, title: 'Expert Installation', desc: 'Professional setup by trained technicians.' },
              { icon: FiCheckCircle, title: 'Genuine Products', desc: '100% genuine and high-quality purifiers.' },
              { icon: FiClock, title: 'Quick Service', desc: 'Prompt response and resolution to issues.' },
              { icon: FiShield, title: 'Affordable AMC', desc: 'Cost-effective annual maintenance plans.' }
            ].map((feature, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <ScrollReveal delay={idx * 0.1}>
                  <div className="feature-card text-center p-4 h-100 hover-lift">
                    <div className="icon-badge feature-card-icon mb-3">
                      <feature.icon size={26} />
                    </div>
                    <h5 className="fw-bold mb-2">{feature.title}</h5>
                    <p className="text-secondary small mb-0">{feature.desc}</p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-pad section-tinted">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 gap-3">
            <ScrollReveal direction="left">
              <SectionHead
                align="start"
                eyebrow="Catalogue"
                title="Featured Products"
                subtitle="Discover our top-rated water purifiers."
              />
            </ScrollReveal>
            <Link to="/products" className="btn btn-outline-primary rounded-pill px-4 btn-shine bg-card">
              View All Products <FiArrowRight className="ms-1" />
            </Link>
          </div>
          <div className="row g-4">
            {products.map((product, idx) => (
              <div key={product.id || idx} className="col-md-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-pad">
        <div className="container">
          <ScrollReveal>
            <SectionHead eyebrow="What we do" title="Our Services" subtitle="Comprehensive RO solutions at your doorstep." />
          </ScrollReveal>
          <div className="row g-4 mt-1">
            {[
              { icon: FiTool, title: 'RO Installation', description: 'Complete installation of domestic RO water purifiers with expert setup.' },
              { icon: FiTool, title: 'RO Repair', description: 'Quick diagnosis and repair of all types of RO purifier issues.' },
              { icon: FiCheckCircle, title: 'Servicing', description: 'Regular maintenance and servicing to keep your purifier performing at its best.' },
              { icon: FiShield, title: 'AMC Plans', description: 'Annual Maintenance Contracts for worry-free purifier maintenance.' }
            ].map((service, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad section-dark-band">
        <div className="container">
          <ScrollReveal>
            <SectionHead
              eyebrow="Simple process"
              title="From Enquiry to Clean Water"
              subtitle="Four clear steps — no chasing, no guesswork."
            />
          </ScrollReveal>
          <div className="row g-4 mt-1">
            {[
              { step: '01', title: 'Tell us what you need', desc: 'Share your water problem or pick a purifier from the catalogue.' },
              { step: '02', title: 'Get a Ticket ID', desc: 'We register the request and give you a trackable ticket instantly.' },
              { step: '03', title: 'Technician visit', desc: 'A trained technician is assigned and you follow every status update.' },
              { step: '04', title: 'Pure water, AMC ready', desc: 'Installation complete, and add an AMC plan to stay covered all year.' }
            ].map((item, idx) => (
              <div key={item.step} className="col-md-6 col-lg-3">
                <ScrollReveal delay={idx * 0.1}>
                  <div className="process-card p-4 h-100">
                    <span className="process-step">{item.step}</span>
                    <h5 className="fw-bold mb-2">{item.title}</h5>
                    <p className="text-secondary small mb-0">{item.desc}</p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-pad">
        <div className="container">
          <ReviewSection />
        </div>
      </section>

      {/* FAQ & CTA */}
      <section className="section-pad section-tinted">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-7">
              <ScrollReveal direction="left">
                <SectionHead
                  align="start"
                  eyebrow="Answers"
                  title="Frequently Asked Questions"
                />
                <div className="premium-panel p-4 mt-4">
                  <FAQ />
                </div>
              </ScrollReveal>
            </div>
            <div className="col-lg-5">
              <ScrollReveal direction="right">
                <div className="cta-card p-4 p-md-5 text-center text-lg-start">
                  <h2 className="fw-bold mb-3">Ready for Pure Water?</h2>
                  <p className="text-secondary mb-4">
                    Book a service or consult with our experts to find the right purifier for your home.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                    <Link to="/book-service" className="btn btn-primary btn-lg rounded-pill px-4 btn-shine hover-glow">
                      Book a Service
                    </Link>
                    <Link to="/contact" className="btn btn-outline-primary btn-lg rounded-pill px-4 bg-card btn-shine">
                      Contact Us
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
