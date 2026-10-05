import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDroplet, FiCheckCircle, FiPhone } from 'react-icons/fi';
import { generateWhatsAppLink, BUSINESS_PHONE } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';
import KitchenHero3D from './KitchenHero3D';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }
  })
};

const HeroSection = () => {
  const { hero, lang } = useLanguage();

  return (
    <section className="hero-section">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-aurora" aria-hidden="true" />

      <div className="container position-relative z-1">
        <div className="row align-items-center g-5">
          {/* ---------------- copy ---------------- */}
          <div className="col-lg-6 hero-copy-col">
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <div className="hero-badge">
                <FiDroplet className="me-2" />
                <span className="fw-medium small">{hero.badge}</span>
              </div>
            </motion.div>

            <motion.h1 className="hero-title mb-3" variants={fadeUp} initial="hidden" animate="show" custom={1}>
              <span className="hero-title-main">Raj Enterprises</span>
              <span className="hero-title-rule" aria-hidden="true" />
            </motion.h1>

            {/* Brand-exact three-language lockup: Marathi, Hindi, English */}
            <motion.div className="hero-tagline-block" variants={fadeUp} initial="hidden" animate="show" custom={2}>
              {hero.taglineLines.map((line, idx) => (
                <p
                  key={line.text}
                  lang={line.lang}
                  className={`hero-tagline-line hero-tagline-${idx === 0 ? 'primary' : idx === 1 ? 'secondary' : 'tertiary'}`}
                >
                  {line.text}
                </p>
              ))}
              <span className="visually-hidden">{hero.tagline}</span>
            </motion.div>

            <motion.p className="hero-lead" variants={fadeUp} initial="hidden" animate="show" custom={3}>
              {hero.lead}
              <br className="d-none d-md-block" />
              {hero.services}
            </motion.p>

            <motion.div className="d-flex flex-wrap gap-3 mb-4 hero-points" variants={fadeUp} initial="hidden" animate="show" custom={4}>
              {hero.points.map((point) => (
                <span key={point} className="d-inline-flex align-items-center small text-secondary">
                  <FiCheckCircle className="text-accent me-2" />
                  {point}
                </span>
              ))}
            </motion.div>

            <motion.div className="d-flex flex-wrap gap-2" variants={fadeUp} initial="hidden" animate="show" custom={5}>
              <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm btn-shine hover-glow">
                {hero.explore}
              </Link>
              <Link to="/book-service" className="btn btn-outline-primary btn-lg rounded-pill px-4 btn-shine bg-card">
                {hero.book}
              </Link>
              <a
                href={generateWhatsAppLink(
                  BUSINESS_PHONE,
                  'Hi Raj Enterprises! I am interested in your RO water purifier services. Please share more details.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg rounded-pill px-4 btn-shine btn-whatsapp"
              >
                {hero.whatsapp}
              </a>
            </motion.div>

            <motion.div className="hero-trust-row" variants={fadeUp} initial="hidden" animate="show" custom={6}>
              <div className="hero-trust">
                <span className="hero-stat-dot" aria-hidden="true" />
                <span className="text-muted small">Service area</span>
                <strong className="text-accent">Navi Mumbai</strong>
              </div>
              <span className="vr d-none d-sm-block" />
              <div className="hero-trust">
                <FiPhone className="text-accent" aria-hidden="true" />
                <span className="text-muted small">Call</span>
                <a href={`tel:${BUSINESS_PHONE}`} className="fw-medium">
                  {BUSINESS_PHONE}
                </a>
              </div>
              <span className="vr d-none d-sm-block" />
              <div className="hero-trust">
                <span className="text-muted small">Warranty</span>
                <strong className="text-accent">1 Year</strong>
              </div>
            </motion.div>
          </div>

          {/* ---------------- 3D kitchen scene ---------------- */}
          <div className="col-lg-6 text-center hero-visual-col">
            <KitchenHero3D />
            <p className="hero-visual-note">
              Illustration of a typical under-counter domestic RO installation.
              Actual models, colours and specifications are shown on the{' '}
              <Link to="/products">Products</Link> page.
            </p>
          </div>
        </div>
      </div>

      <div className="hero-scroll-cue" aria-hidden="true">
        <FiArrowRight style={{ transform: 'rotate(90deg)' }} className="text-accent fs-4" />
      </div>
    </section>
  );
};

export default HeroSection;
