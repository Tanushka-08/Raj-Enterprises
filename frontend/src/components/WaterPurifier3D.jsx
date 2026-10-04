import React from 'react';
import { motion } from 'framer-motion';
import { FiDroplet, FiZap, FiShield } from 'react-icons/fi';

// A CSS/SVG "3D" under-sink RO purifier. Everything is vector + transform so it
// stays crisp at any size, animates on the GPU, and needs no image download.
const WaterPurifier3D = () => {
  return (
    <div className="purifier-stage" role="img" aria-label="Animated 3D illustration of a home RO water purifier">

      {/* soft platform glow + contact shadow */}
      <div className="purifier-glow" aria-hidden="true" />
      <div className="purifier-shadow" aria-hidden="true" />

      {/* orbiting water rings */}
      <div className="purifier-orbit purifier-orbit-a" aria-hidden="true" />
      <div className="purifier-orbit purifier-orbit-b" aria-hidden="true" />

      <motion.div
        className="purifier-body"
        initial={{ opacity: 0, y: 46, rotateX: 18 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="purifier-float" aria-hidden="true">
          <svg viewBox="0 0 240 400" className="purifier-svg">
            <defs>
              {/* body shell gradient - reads as glossy white plastic */}
              <linearGradient id="shell" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c9d4de" />
                <stop offset="18%" stopColor="#f2f6fa" />
                <stop offset="46%" stopColor="#ffffff" />
                <stop offset="78%" stopColor="#e4ecf3" />
                <stop offset="100%" stopColor="#aab8c6" />
              </linearGradient>

              {/* front face panel */}
              <linearGradient id="panel" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e8eef4" />
              </linearGradient>

              {/* blue accent fascia */}
              <linearGradient id="fascia" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="55%" stopColor="#0077b6" />
                <stop offset="100%" stopColor="#0b4a72" />
              </linearGradient>

              {/* translucent water reservoir */}
              <linearGradient id="tank" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
              </linearGradient>

              {/* chrome spout */}
              <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7f8c99" />
                <stop offset="35%" stopColor="#eef3f7" />
                <stop offset="65%" stopColor="#b6c3ce" />
                <stop offset="100%" stopColor="#6d7b88" />
              </linearGradient>

              {/* specular highlight sweep */}
              <linearGradient id="gloss" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>

            {/* ---- main housing ---- */}
            <rect x="34" y="26" width="172" height="330" rx="26" fill="url(#shell)" />
            {/* right side shading gives the box its depth */}
            <path d="M188 52 a26 26 0 0 1 18 26 v252 a26 26 0 0 1 -18 26 Z" fill="#8fa0ae" opacity="0.35" />

            {/* ---- top cap ---- */}
            <rect x="34" y="26" width="172" height="34" rx="26" fill="#f7fafc" />
            <rect x="34" y="52" width="172" height="8" fill="#d3dde5" />

            {/* brand dot */}
            <circle cx="120" cy="43" r="7" fill="url(#fascia)" />

            {/* ---- blue accent fascia under the cap ---- */}
            <rect x="34" y="60" width="172" height="16" fill="url(#fascia)" />

            {/* ---- front control panel ---- */}
            <rect x="58" y="96" width="124" height="66" rx="14" fill="url(#panel)" stroke="#c3d0da" strokeWidth="1.5" />

            {/* digital TDS readout */}
            <rect x="70" y="108" width="72" height="30" rx="7" fill="#062b3d" />
            <text x="106" y="129" textAnchor="middle" className="purifier-tds" fontSize="17" fill="#4ade80" fontFamily="monospace">
              008
            </text>
            <text x="106" y="152" textAnchor="middle" fontSize="8" fill="#7b8b99" letterSpacing="1">
              TDS ppm
            </text>

            {/* indicator lamps */}
            <circle cx="158" cy="117" r="5.5" fill="#22c55e" className="purifier-led purifier-led-on" />
            <circle cx="158" cy="136" r="5.5" fill="#94a3b8" className="purifier-led" />
            <circle cx="158" cy="155" r="5.5" fill="#94a3b8" className="purifier-led" />

            {/* ---- filter cartridge window ---- */}
            <rect x="58" y="180" width="124" height="104" rx="14" fill="#eef3f7" stroke="#c3d0da" strokeWidth="1.5" />

            {/* three vertical filter cartridges */}
            <g>
              <rect x="72" y="192" width="28" height="80" rx="14" fill="url(#fascia)" opacity="0.9" />
              <rect x="106" y="192" width="28" height="80" rx="14" fill="url(#tank)" opacity="0.9" />
              <rect x="140" y="192" width="28" height="80" rx="14" fill="url(#chrome)" opacity="0.85" />
              {/* cartridge highlight */}
              <rect x="76" y="196" width="6" height="72" rx="3" fill="#ffffff" opacity="0.45" />
              <rect x="110" y="196" width="6" height="72" rx="3" fill="#ffffff" opacity="0.5" />
              <rect x="144" y="196" width="6" height="72" rx="3" fill="#ffffff" opacity="0.4" />
            </g>

            {/* live water level inside the middle cartridge */}
            <clipPath id="tankClip">
              <rect x="106" y="192" width="28" height="80" rx="14" />
            </clipPath>
            <rect
              x="106"
              y="216"
              width="28"
              height="56"
              fill="#38bdf8"
              opacity="0.55"
              clipPath="url(#tankClip)"
              className="purifier-water"
            />

            {/* ---- lower service panel ---- */}
            <rect x="58" y="300" width="124" height="40" rx="12" fill="url(#panel)" stroke="#c3d0da" strokeWidth="1.5" />
            <text x="120" y="325" textAnchor="middle" fontSize="11" fill="#5b6b7a" letterSpacing="2">
              FILTER CHANGE
            </text>

            {/* ---- dispense spout ---- */}
            <path d="M120 356 v22 a10 10 0 0 0 10 10 h26" stroke="url(#chrome)" strokeWidth="11" fill="none" strokeLinecap="round" />
            <circle cx="160" cy="388" r="8" fill="url(#chrome)" />

            {/* falling water drop from the spout */}
            <path
              d="M160 400 c-7 0 -12 6 -12 12 a12 12 0 0 0 24 0 c0 -6 -5 -12 -12 -12 z"
              fill="#38bdf8"
              className="purifier-drip"
            />

            {/* glossy sweep across the shell */}
            <rect x="34" y="26" width="172" height="330" rx="26" fill="url(#gloss)" className="purifier-gloss" />
          </svg>
        </div>

        {/* floating feature chips around the unit */}
        <motion.div
          className="purifier-chip purifier-chip-tds"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <FiDroplet />
          <div>
            <small>TDS</small>
            <strong>8 ppm</strong>
          </div>
        </motion.div>

        <motion.div
          className="purifier-chip purifier-chip-power"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
        >
          <FiZap />
          <div>
            <small>Power</small>
            <strong>Zero Wastage</strong>
          </div>
        </motion.div>

        <motion.div
          className="purifier-chip purifier-chip-ro"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <FiShield />
          <div>
            <small>RO</small>
            <strong>6 Stage</strong>
          </div>
        </motion.div>
      </motion.div>

      {/* rising bubbles for depth */}
      <div className="purifier-bubbles" aria-hidden="true">
        {[
          { left: '18%', size: 9, delay: 0, dur: 5.5 },
          { left: '32%', size: 6, delay: 1.4, dur: 6.4 },
          { left: '68%', size: 7, delay: 0.7, dur: 6 },
          { left: '82%', size: 10, delay: 2.3, dur: 5.2 }
        ].map((b, i) => (
          <span
            key={i}
            className="purifier-bubble"
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
    </div>
  );
};

export default WaterPurifier3D;