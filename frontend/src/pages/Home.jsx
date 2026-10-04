import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ScrollReveal from '../components/ScrollReveal';
import ServiceCard from '../components/ServiceCard';
import ProductCard from '../components/ProductCard';
import ReviewSection from '../components/ReviewSection';
import FAQ from '../components/FAQ';
import { FiCheckCircle, FiTool, FiClock, FiShield, FiMapPin } from 'react-icons/fi';
import { apiService } from '../services/api';
import { mapProduct } from '../utils/helpers';

// Offline fallback used only when the API/DB is unreachable
const fallbackFeatured = [
  { id: '1', name: 'Aqua Innovica', brand: 'Aqua Innovica', price: 15999, mrp: 19999, category: 'domestic-ro', technology: '3-in-1 Zinc + Copper + Alkaline', storageCapacity: '9L', shortDesc: 'Compact 9L premium purifier with advanced filtration.', specs: { filtrationStages: 8, warranty: '1 Year Warranty' }, features: ['Compact Design', '9 Litre Storage'], variants: [{ colorCode: '#7986cb', colorName: 'Blue Lavender', image: '/images/products/9e33eada-a2e3-42d2-b26d-e37f9d642c59.jfif' }] },
  { id: '2', name: 'AquaX Swift', brand: 'AquaX Series', price: 16999, mrp: 21999, category: 'domestic-ro', technology: 'RO + 3-in-1 Zinc/Copper/Alkaline', storageCapacity: '15L', shortDesc: 'Premium purifier with 3-in-1 protection.', specs: { filtrationStages: 12, warranty: '1 Year Warranty' }, features: ['3-in-1 Protection', 'Transparent Top Design'], variants: [{ colorCode: '#2d1810', colorName: 'Black & Copper', image: '/images/products/1fc212e0-6eb4-4395-97ad-fac0cefe7ad6.jfif' }] },
  { id: '3', name: 'Purella', brand: 'Purella', price: 7999, mrp: 10999, category: 'uv-purifier', technology: 'UV Purification', storageCapacity: 'Tankless (Inline)', shortDesc: '3-stage UV system for low-TDS water.', specs: { filtrationStages: 3, warranty: '1 Year Warranty' }, features: ['UV Purification', '5L/min Flow Rate'], variants: [{ colorCode: '#37474f', colorName: 'Black & Silver', image: '/images/products/WhatsApp Image 2026-10-02 at 3.05.14 PM.jpeg' }] }
];

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

      {/* Why Choose Us */}
      <section className="py-5 bg-secondary bg-opacity-10">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold heading-underline is-in">Why Choose Raj Enterprises?</h2>
            <p className="text-muted">Domestic RO water purification experts serving Navi Mumbai.</p>
          </div>
          <div className="row g-4">
            {[
              { icon: FiTool, title: 'Expert Installation', desc: 'Professional setup by trained technicians.' },
              { icon: FiCheckCircle, title: 'Genuine Products', desc: '100% genuine and high-quality purifiers.' },
              { icon: FiClock, title: 'Quick Service', desc: 'Prompt response and resolution to issues.' },
              { icon: FiShield, title: 'Affordable AMC', desc: 'Cost-effective annual maintenance plans.' }
            ].map((feature, idx) => (
              <div key={idx} className="col-md-3">
                <ScrollReveal delay={idx * 0.1}>
                  <div className="text-center p-4 bg-card rounded-4 shadow-sm h-100 border hover-lift">
                    <div className="d-inline-flex align-items-center justify-content-center bg-accent bg-opacity-10 text-accent rounded-circle mb-3 icon-badge" style={{ width: '60px', height: '60px' }}>
                      <feature.icon size={28} />
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
      <section className="py-5">
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <h2 className="fw-bold mb-2 heading-underline is-in">Featured Products</h2>
              <p className="text-muted mb-0">Discover our top-rated water purifiers.</p>
            </div>
            <Link to="/products" className="btn btn-outline-primary rounded-pill d-none d-md-inline-block">View All Products</Link>
          </div>
          <div className="row g-4">
            {products.map((product, idx) => (
              <div key={product.id || idx} className="col-md-6 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4 d-md-none">
            <Link to="/products" className="btn btn-outline-primary rounded-pill w-100">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-5 bg-card border-top border-bottom">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold heading-underline is-in">Our Services</h2>
            <p className="text-muted">Comprehensive RO solutions at your doorstep.</p>
          </div>
          <div className="row g-4">
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

      {/* Trust highlights (no unverified statistics) */}
      <section className="py-5 bg-accent text-on-accent">
        <div className="container py-4">
          <div className="row g-4 text-center">
            {[
              { icon: FiShield, text: '1 Year Warranty' },
              { icon: FiMapPin, text: 'Service Area: Navi Mumbai' },
              { icon: FiTool, text: 'Installation, Repair & Servicing' },
              { icon: FiCheckCircle, text: 'AMC Plans Available' }
            ].map((item, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="h-100 rounded-4 px-2 py-3 hover-glow">
                  <item.icon size={36} className="mb-2 animate-float" />
                  <p className="mb-0 opacity-75 fw-medium">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <div className="container">
        <ReviewSection />
      </div>

      {/* FAQ & CTA */}
      <section className="py-5 bg-secondary bg-opacity-10">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <ScrollReveal direction="left">
                <h2 className="fw-bold mb-4 heading-underline is-in">Frequently Asked Questions</h2>
                <div className="bg-card p-4 rounded-4 shadow-sm border">
                  <FAQ />
                </div>
              </ScrollReveal>
            </div>
            <div className="col-lg-5 offset-lg-1 text-center text-lg-start">
              <ScrollReveal direction="right">
                <h2 className="fw-bold mb-3">Ready for Pure Water?</h2>
                <p className="lead text-muted mb-4">Book a service or consult with our experts to find the right purifier for your home.</p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                  <Link to="/book-service" className="btn btn-primary btn-lg rounded-pill px-4 btn-shine hover-glow">Book a Service</Link>
                  <Link to="/contact" className="btn btn-outline-primary btn-lg rounded-pill px-4 bg-card btn-shine">Contact Us</Link>
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
