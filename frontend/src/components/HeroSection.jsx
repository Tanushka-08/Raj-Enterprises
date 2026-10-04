import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDroplet, FiCheckCircle } from 'react-icons/fi';
import { generateWhatsAppLink, BUSINESS_PHONE } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';
import WaterPurifier3D from './WaterPurifier3D';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] }
  })
};

const bubbles = [
  { left: '6%', size: 14, delay: 0, dur: 13 },
  { left: '17%', size: 9, delay: 2.4, dur: 16 },
  { left: '31%', size: 20, delay: 4.1, dur: 15 },
  { left: '46%', size: 11, delay: 1.2, dur: 18 },
  { left: '58%', size: 16, delay: 5.5, dur: 14 },
  { left: '71%', size: 10, delay: 3.2, dur: 17 },
  { left: '84%', size: 18, delay: 6.4, dur: 15 },
  { left: '93%', size: 12, delay: 0.9, dur: 19 }
];

const HeroSection = () => {
  const { hero, lang } = useLanguage();

  return (
    <section className="hero-section">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-aurora" aria-hidden="true" />

      <div className="bubble-field" aria-hidden="true">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDuration: `${b.dur}s`,
              animationDelay: `${b.delay}s`
            }}
          />
        ))}
      </div>

      <div className="container position-relative z-1">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <motion.div
              className="d-flex flex-wrap align-items-center gap-2 mb-4"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
            >
              <div className="d-inline-flex align-items-center bg-accent bg-opacity-10 text-accent px-3 py-2 rounded-pill border border-primary border-opacity-25 animate-pop-in">
                <FiDroplet className="me-2" />
                <span className="fw-medium small">{hero.badge}</span>
              </div>
            </motion.div>

            <motion.h1
              className="display-3 fw-bold mb-3 text-gradient animate-gradient"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
            >
              Raj Enterprises
            </motion.h1>

            <motion.h2
              className="h4 fw-normal mb-3 text-secondary hero-tagline"
              lang={lang}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
            >
              {hero.tagline}
            </motion.h2>

            <motion.div
              className="lead mb-4 text-muted"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
            >
              {hero.lead}
              <br className="d-none d-md-block" />
              {hero.services}
            </motion.div>

            <motion.div
              className="d-flex flex-wrap gap-2 mb-4"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
            >
              {hero.points.map((point) => (
                <span key={point} className="d-inline-flex align-items-center small text-secondary">
                  <FiCheckCircle className="text-accent me-2 animate-pop-in" />
                  {point}
                </span>
              ))}
            </motion.div>

            <motion.div
              className="d-flex flex-wrap gap-3"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={5}
            >
              <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm btn-shine hover-glow">
                {hero.explore}
              </Link>
              <Link to="/book-service" className="btn btn-outline-primary btn-lg rounded-pill px-4 btn-shine">
                {hero.book}
              </Link>
              <a
                href={generateWhatsAppLink(
                  BUSINESS_PHONE,
                  'Hi Raj Enterprises! I am interested in your RO water purifier services. Please share more details.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg rounded-pill px-4 btn-shine"
                style={{ backgroundColor: '#0F7A63', borderColor: '#0F7A63', color: 'white' }}
              >
                {hero.whatsapp}
              </a>
            </motion.div>
          </div>

          <div className="col-lg-6 text-center">
            <WaterPurifier3D />

            <motion.div
              className="d-inline-flex align-items-center gap-2 bg-card border rounded-4 shadow-sm px-3 py-2 mt-4 hero-stat-chip"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.6 }}
            >
              <span className="hero-stat-dot" aria-hidden="true" />
              <small className="text-muted">Service area</small>
              <strong className="text-accent">Navi Mumbai</strong>
              <span className="vr" />
              <small className="text-muted">Warranty</small>
              <strong className="text-accent">1 Year</strong>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 animate-bob" style={{ zIndex: 2 }}>
        <FiArrowRight style={{ transform: 'rotate(90deg)' }} className="text-accent fs-4" />
      </div>
    </section>
  );
};

export default HeroSection;