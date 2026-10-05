import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Hero scene: a warm, modern Navi-Mumbai apartment kitchen with a domestic RO
 * as the main character.
 *
 * Everything is hand-built vector (no image download, crisp at any size, GPU
 * animated). The scene is layered so the mouse can parallax the back wall,
 * cabinet and unit independently, which is what sells the depth.
 *
 * NOTE: this is a *visual hero model only*. It does not represent, and must
 * never be used to alter, any product in the Raj Enterprises catalogue.
 */

const KitchenHero3D = () => {
  const reduce = useReducedMotion();
  const sceneRef = useRef(null);

  // Cheap pointer parallax: no re-renders, transforms are written directly.
  const onPointerMove = (e) => {
    if (reduce || !sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const set = (name, x, y) => {
      const el = sceneRef.current.querySelector(`[data-depth="${name}"]`);
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    set('wall', px * -6, py * -4);
    set('cabinet', px * -12, py * -6);
    set('unit', px * 6, py * 3);
    set('light', px * -18, py * -10);
    set('foreground', px * 16, py * 7);
  };

  const resetPointer = () => {
    if (!sceneRef.current) return;
    sceneRef.current.querySelectorAll('[data-depth]').forEach((el) => {
      el.style.transform = 'translate3d(0,0,0)';
    });
  };

  return (
    <div className="kitchen-scene" ref={sceneRef} onPointerMove={onPointerMove} onPointerLeave={resetPointer}>
      <div className="kitchen-scene-frame">
        <svg
          viewBox="0 0 760 600"
          className="kitchen-scene-svg"
          role="img"
          aria-label="Modern Indian home kitchen with a domestic RO water purifier installed under the counter"
        >
          <defs>
            {/* ---------------- light & surfaces ---------------- */}
            <linearGradient id="k-wall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f6efe6" />
              <stop offset="55%" stopColor="#efe4d7" />
              <stop offset="100%" stopColor="#e2d3c1" />
            </linearGradient>
            <linearGradient id="k-wall-shade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#6b4f36" stopOpacity="0.22" />
            </linearGradient>

            {/* backsplash tiles */}
            <linearGradient id="k-tile" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f3ece3" />
              <stop offset="100%" stopColor="#e2d5c6" />
            </linearGradient>
            <pattern id="k-tiles" width="58" height="44" patternUnits="userSpaceOnUse">
              <rect width="58" height="44" fill="#efe6da" />
              <rect x="1.5" y="1.5" width="55" height="41" rx="6" fill="url(#k-tile)" />
              <path d="M6 6 H50" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />
            </pattern>

            {/* cabinet (matte laminate, warm) */}
            <linearGradient id="k-cab" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8d6a4c" />
              <stop offset="18%" stopColor="#7a5940" />
              <stop offset="100%" stopColor="#5d4130" />
            </linearGradient>
            <linearGradient id="k-cab-door" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9a7454" />
              <stop offset="55%" stopColor="#7f5d42" />
              <stop offset="100%" stopColor="#664833" />
            </linearGradient>

            {/* granite counter */}
            <linearGradient id="k-counter" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a4f56" />
              <stop offset="14%" stopColor="#3c4148" />
              <stop offset="100%" stopColor="#22262b" />
            </linearGradient>
            <linearGradient id="k-counter-edge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6c737c" />
              <stop offset="30%" stopColor="#8b939c" />
              <stop offset="60%" stopColor="#5a6169" />
              <stop offset="100%" stopColor="#3b4046" />
            </linearGradient>

            {/* steel sink + chrome */}
            <linearGradient id="k-steel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7d868f" />
              <stop offset="22%" stopColor="#e7edf2" />
              <stop offset="52%" stopColor="#aeb8c1" />
              <stop offset="78%" stopColor="#f2f6f9" />
              <stop offset="100%" stopColor="#6f7880" />
            </linearGradient>
            <linearGradient id="k-chrome" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b959e" />
              <stop offset="28%" stopColor="#f4f8fb" />
              <stop offset="60%" stopColor="#b3bdc6" />
              <stop offset="100%" stopColor="#79838c" />
            </linearGradient>

            {/* RO body: glossy white ABS */}
            <linearGradient id="k-body" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cdd7df" />
              <stop offset="14%" stopColor="#f4f8fb" />
              <stop offset="44%" stopColor="#ffffff" />
              <stop offset="72%" stopColor="#e6edf3" />
              <stop offset="100%" stopColor="#a9b7c4" />
            </linearGradient>
            <linearGradient id="k-body-side" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9aa9b7" />
              <stop offset="100%" stopColor="#78889a" />
            </linearGradient>
            <linearGradient id="k-panel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e9eff5" />
            </linearGradient>
            {/* brand accent: deep water blue, not neon */}
            <linearGradient id="k-accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2f9fd0" />
              <stop offset="48%" stopColor="#0f6f9e" />
              <stop offset="100%" stopColor="#08425f" />
            </linearGradient>
            <linearGradient id="k-tank" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#bfe4f4" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#7cc7e6" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#4aa3cc" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#8fd0ea" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="k-screen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d2b3a" />
              <stop offset="100%" stopColor="#061821" />
            </linearGradient>
            <linearGradient id="k-water" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d8f2fd" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#5fbfe4" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="k-glass" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
            </linearGradient>
            <radialGradient id="k-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#ffe9c9" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffe9c9" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="k-daylight" x1="100%" y1="0%" x2="0%" y2="60%">
              <stop offset="0%" stopColor="#fff6e2" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#fff6e2" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#fff6e2" stopOpacity="0" />
            </linearGradient>

            <filter id="k-blur-lg" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
            <filter id="k-blur-sm" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="k-blur-md" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <filter id="k-shadow-ro" x="-50%" y="-30%" width="200%" height="190%">
              <feDropShadow dx="14" dy="18" stdDeviation="14" floodColor="#2a1d12" floodOpacity="0.38" />
            </filter>
          </defs>

          {/* =============== BACK WALL + LIGHT =============== */}
          <g data-depth="wall" style={{ transition: 'transform .5s cubic-bezier(.16,1,.3,1)' }}>
            <rect x="0" y="0" width="760" height="600" fill="url(#k-wall)" />
            <rect x="0" y="250" width="760" height="200" fill="url(#k-tiles)" />
            <rect x="0" y="0" width="760" height="600" fill="url(#k-wall-shade)" />

            {/* window with morning light */}
            <g>
              <rect x="42" y="52" width="196" height="188" rx="10" fill="#dceaf2" />
              <rect x="50" y="60" width="180" height="172" rx="6" fill="url(#k-daylight)" />
              <rect x="50" y="60" width="180" height="172" rx="6" fill="#eaf4fa" />
              <path d="M140 60 V232 M50 146 H230" stroke="#ffffff" strokeWidth="7" />
              <rect x="42" y="52" width="196" height="188" rx="10" fill="none" stroke="#b9c8d3" strokeWidth="4" />
              {/* distant skyline hint, very soft */}
              <g opacity="0.28">
                <rect x="66" y="150" width="26" height="82" fill="#a9c2d2" />
                <rect x="100" y="176" width="34" height="56" fill="#bccfdc" />
                <rect x="146" y="132" width="22" height="100" fill="#9fb9cb" />
                <rect x="178" y="164" width="38" height="68" fill="#b6c9d6" />
              </g>
              <rect x="42" y="52" width="196" height="188" rx="10" fill="url(#k-daylight)" />
            </g>

            {/* soft window light spill on the wall */}
            <ellipse cx="150" cy="250" rx="230" ry="120" fill="#fff3dd" opacity="0.5" filter="url(#k-blur-lg)" />
          </g>

          {/* =============== UPPER CABINETS =============== */}
          <g data-depth="cabinet" style={{ transition: 'transform .5s cubic-bezier(.16,1,.3,1)' }}>
            <rect x="300" y="34" width="432" height="196" rx="8" fill="url(#k-cab)" />
            <rect x="300" y="34" width="432" height="14" rx="6" fill="#a5825f" />
            {/* door split + handles */}
            <rect x="314" y="54" width="196" height="160" rx="7" fill="url(#k-cab-door)" />
            <rect x="522" y="54" width="196" height="160" rx="7" fill="url(#k-cab-door)" />
            <rect x="482" y="110" width="6" height="52" rx="3" fill="#d9c3a6" />
            <rect x="538" y="110" width="6" height="52" rx="3" fill="#d9c3a6" />
            <rect x="314" y="54" width="196" height="6" rx="3" fill="#ffffff" opacity="0.18" />
            <rect x="522" y="54" width="196" height="6" rx="3" fill="#ffffff" opacity="0.18" />
            {/* under-cabinet shadow */}
            <rect x="300" y="222" width="432" height="14" fill="#3a2718" opacity="0.28" filter="url(#k-blur-sm)" />
            {/* warm strip light under the cabinet */}
            <rect x="322" y="228" width="388" height="5" rx="2.5" fill="#ffe6bb" opacity="0.9" />
            <rect x="322" y="228" width="388" height="26" rx="13" fill="#ffe6bb" opacity="0.28" filter="url(#k-blur-md)" />
          </g>

          {/* =============== COUNTER =============== */}
          <g>
            <rect x="0" y="446" width="760" height="30" fill="url(#k-counter-edge)" />
            <rect x="0" y="474" width="760" height="126" fill="url(#k-counter)" />
            {/* speckle for granite realism */}
            <g opacity="0.5">
              <circle cx="60" cy="500" r="2.2" fill="#9aa4ae" />
              <circle cx="150" cy="520" r="1.8" fill="#8d97a1" />
              <circle cx="240" cy="496" r="2.4" fill="#a7b1ba" />
              <circle cx="330" cy="524" r="2" fill="#8d97a1" />
              <circle cx="420" cy="502" r="2.6" fill="#a7b1ba" />
              <circle cx="512" cy="528" r="2" fill="#98a2ac" />
              <circle cx="604" cy="498" r="2.4" fill="#a7b1ba" />
              <circle cx="690" cy="520" r="2.2" fill="#8d97a1" />
              <circle cx="100" cy="560" r="2" fill="#98a2ac" />
              <circle cx="360" cy="570" r="2.4" fill="#a7b1ba" />
              <circle cx="620" cy="566" r="2" fill="#98a2ac" />
            </g>
            {/* countertop reflection band */}
            <rect x="0" y="446" width="760" height="30" fill="#ffffff" opacity="0.1" />
          </g>

          {/* =============== SINK + TAP (left) =============== */}
          <g>
            <rect x="34" y="430" width="196" height="34" rx="10" fill="#9aa3ac" opacity="0.5" />
            <rect x="42" y="432" width="180" height="30" rx="8" fill="#6f7880" />
            <rect x="52" y="438" width="160" height="20" rx="6" fill="url(#k-steel)" />
            {/* tap */}
            <path
              d="M132 430 V360 a30 30 0 0 1 30 -30 h22"
              fill="none"
              stroke="url(#k-chrome)"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <rect x="176" y="322" width="14" height="16" rx="6" fill="url(#k-chrome)" />
            {/* soft shadow of the tap on the counter */}
            <ellipse cx="150" cy="462" rx="56" ry="8" fill="#151a1f" opacity="0.28" filter="url(#k-blur-sm)" />
          </g>

          {/* =============== PROPS (right of the RO) =============== */}
          <g data-depth="cabinet" style={{ transition: 'transform .5s cubic-bezier(.16,1,.3,1)' }}>
            {/* steel vessel */}
            <g>
              <ellipse cx="672" cy="470" rx="34" ry="9" fill="#151a1f" opacity="0.3" filter="url(#k-blur-sm)" />
              <path d="M646 400 h52 l-6 62 a8 8 0 0 1 -8 7 h-24 a8 8 0 0 1 -8 -7 z" fill="url(#k-steel)" />
              <ellipse cx="672" cy="400" rx="26" ry="7" fill="#dbe3ea" />
              <ellipse cx="672" cy="400" rx="18" ry="4.5" fill="#aab4bd" />
              <path d="M654 414 v46" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* small plant */}
            <g>
              <ellipse cx="592" cy="470" rx="26" ry="8" fill="#151a1f" opacity="0.26" filter="url(#k-blur-sm)" />
              <path d="M576 428 h32 l-5 40 a6 6 0 0 1 -6 5 h-10 a6 6 0 0 1 -6 -5 z" fill="#c98b5f" />
              <ellipse cx="592" cy="428" rx="16" ry="5" fill="#a86f47" />
              <path d="M592 428 C 588 404, 574 396, 566 392 C 578 392, 590 404, 592 428" fill="#4f8f5f" />
              <path d="M592 428 C 596 406, 610 398, 620 396 C 608 398, 596 408, 592 428" fill="#3f7a4f" />
              <path d="M592 428 C 592 408, 592 396, 594 388 C 598 400, 598 414, 592 428" fill="#63a173" />
            </g>
          </g>

          {/* =============== RO UNIT — THE HERO =============== */}
          <g data-depth="unit" style={{ transition: 'transform .5s cubic-bezier(.16,1,.3,1)' }}>
            {/* halo that lifts the unit off the wall */}
            <ellipse cx="404" cy="330" rx="196" ry="212" fill="url(#k-halo)" opacity="0.75" filter="url(#k-blur-lg)" />

            {/* contact shadow on the wall + counter */}
            <ellipse cx="416" cy="474" rx="118" ry="20" fill="#2a1d12" opacity="0.42" filter="url(#k-blur-md)" />

            <motion.g
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              filter="url(#k-shadow-ro)"
              className="k-ro-unit"
            >
              {/* float lives on this inner node so it cannot fight the entrance
                  transform written by framer-motion onto .k-ro-unit */}
              <g className="k-ro-float">
              {/* side depth (gives the box real thickness) */}
              <path d="M500 214 h26 a20 20 0 0 1 20 20 v216 a20 20 0 0 1 -20 20 h-26 z" fill="url(#k-body-side)" />

              {/* main housing */}
              <rect x="304" y="204" width="200" height="266" rx="26" fill="url(#k-body)" />
              <rect x="304" y="204" width="200" height="266" rx="26" fill="none" stroke="#c3ced8" strokeWidth="1.5" />

              {/* top cap with translucent storage tank */}
              <rect x="304" y="204" width="200" height="30" rx="26" fill="#fbfdfe" />
              <rect x="316" y="212" width="176" height="26" rx="13" fill="url(#k-tank)" />
              <rect x="316" y="212" width="176" height="8" rx="4" fill="#ffffff" opacity="0.55" />
              <rect x="312" y="238" width="184" height="8" fill="#cdd8e1" />

              {/* brand lockup */}
              <circle cx="330" cy="219" r="6" fill="url(#k-accent)" />
              <text x="342" y="223" fontSize="11" fill="#4a5b68" fontFamily="Inter, system-ui, sans-serif" letterSpacing="1.6">
                RAJ
              </text>

              {/* accent fascia */}
              <rect x="304" y="246" width="200" height="15" fill="url(#k-accent)" />
              <rect x="304" y="246" width="200" height="6" fill="#ffffff" opacity="0.25" />

              {/* control panel + live TDS readout */}
              <rect x="326" y="274" width="156" height="62" rx="13" fill="url(#k-panel)" stroke="#c6d2dc" strokeWidth="1.5" />
              <rect x="338" y="285" width="84" height="34" rx="8" fill="url(#k-screen)" />
              <text
                x="380"
                y="307"
                textAnchor="middle"
                fontSize="15"
                fill="#7ee7a8"
                fontFamily="Inter, system-ui, sans-serif"
                letterSpacing="1.4"
                className="k-tds"
              >
                PURE
              </text>
              <text x="380" y="331" textAnchor="middle" fontSize="8.5" fill="#7e8d99" letterSpacing="1.4" fontFamily="Inter, system-ui, sans-serif">
                OUTPUT READY
              </text>

              {/* status lamps */}
              <circle cx="446" cy="293" r="6" fill="#22c55e" className="k-led-on" />
              <circle cx="446" cy="315" r="6" fill="#c3ccd4" />
              <circle cx="452" cy="293" r="2" fill="#bff3d0" opacity="0.8" />

              {/* three filter housings with real media colour */}
              <rect x="326" y="348" width="156" height="98" rx="13" fill="#eef3f7" stroke="#c6d2dc" strokeWidth="1.5" />
              <g>
                {/* sediment */}
                <rect x="338" y="358" width="42" height="78" rx="19" fill="url(#k-chrome)" opacity="0.92" />
                <rect x="338" y="358" width="42" height="52" rx="19" fill="#d8b26a" opacity="0.75" />
                <rect x="346" y="364" width="7" height="66" rx="3.5" fill="#ffffff" opacity="0.5" />
                {/* carbon */}
                <rect x="386" y="358" width="42" height="78" rx="19" fill="url(#k-chrome)" opacity="0.92" />
                <rect x="386" y="358" width="42" height="40" rx="19" fill="#4a5560" opacity="0.7" />
                <rect x="394" y="364" width="7" height="66" rx="3.5" fill="#ffffff" opacity="0.45" />
                {/* RO membrane */}
                <rect x="434" y="358" width="42" height="78" rx="19" fill="url(#k-chrome)" opacity="0.92" />
                <rect x="434" y="358" width="42" height="64" rx="19" fill="url(#k-water)" />
                <rect x="442" y="364" width="7" height="66" rx="3.5" fill="#ffffff" opacity="0.55" />
              </g>
              {/* rising water level inside the membrane housing */}
              <rect x="434" y="384" width="42" height="52" rx="19" fill="#2f9fd0" opacity="0.35" className="k-membrane-water" />

              {/* service label */}
              <rect x="326" y="452" width="156" height="0" fill="none" />
              <text x="404" y="462" textAnchor="middle" fontSize="9" fill="#6c7b88" letterSpacing="1.8" fontFamily="Inter, system-ui, sans-serif">
                DOMESTIC RO • INSTALLED ON SITE
              </text>

              {/* dispense spout */}
              <path d="M404 470 v22 a16 16 0 0 0 16 16 h22" fill="none" stroke="url(#k-chrome)" strokeWidth="13" strokeLinecap="round" />
              <circle cx="450" cy="508" r="10" fill="url(#k-chrome)" />
              <circle cx="450" cy="508" r="4" fill="#5c6771" />

              {/* water stream into the glass */}
              <g className="k-stream">
                <rect x="446" y="516" width="7" height="52" rx="3.5" fill="url(#k-water)" />
                <rect x="450" y="516" width="2" height="52" fill="#ffffff" opacity="0.6" />
              </g>

              {/* glass */}
              <g>
                <path d="M424 560 h56 l-6 44 a10 10 0 0 1 -10 9 h-24 a10 10 0 0 1 -10 -9 z" fill="url(#k-glass)" stroke="#dbe7ee" strokeWidth="2" />
                <path d="M428 578 h48 l-4 26 a8 8 0 0 1 -8 7 h-24 a8 8 0 0 1 -8 -7 z" fill="#7cc7e6" opacity="0.72" className="k-glass-water" />
                <ellipse cx="452" cy="578" rx="24" ry="4" fill="#ffffff" opacity="0.45" />
                <rect x="432" y="566" width="4" height="40" rx="2" fill="#ffffff" opacity="0.5" />
              </g>

              {/* specular sweep travelling down the shell */}
              <rect x="304" y="204" width="200" height="266" rx="26" fill="#ffffff" opacity="0.18" className="k-gloss" transform="skewX(-14)" />
              {/* soft top light on the cap */}
              <ellipse cx="380" cy="216" rx="70" ry="8" fill="#ffffff" opacity="0.5" filter="url(#k-blur-sm)" />
              </g>
            </motion.g>

            {/* micro bubbles around the stream */}
            <g className="k-bubbles">
              {[
                { x: 462, y: 556, r: 3.4, d: 3.6, delay: 0 },
                { x: 470, y: 548, r: 2.4, d: 4.4, delay: 0.9 },
                { x: 438, y: 552, r: 2.8, d: 4, delay: 1.7 },
                { x: 476, y: 560, r: 2, d: 5, delay: 2.4 }
              ].map((b, i) => (
                <circle key={i} cx={b.x} cy={b.y} r={b.r} fill="#ffffff" opacity="0.55" style={{ animation: `kBubbleRise ${b.d}s ease-in infinite`, animationDelay: `${b.delay}s` }} />
              ))}
            </g>
          </g>

          {/* =============== FOREGROUND =============== */}
          <g data-depth="foreground" style={{ transition: 'transform .5s cubic-bezier(.16,1,.3,1)' }}>
            <ellipse cx="300" cy="596" rx="330" ry="70" fill="#1b1208" opacity="0.34" filter="url(#k-blur-lg)" />
            <rect x="0" y="0" width="760" height="600" fill="url(#k-daylight)" opacity="0.35" style={{ mixBlendMode: 'soft-light' }} />
          </g>
        </svg>

        {/* Vignette + inner shadow so the frame reads like a real render */}
        <div className="kitchen-scene-vignette" aria-hidden="true" />
      </div>

      {/* Floating context chips (decorative, hidden from assistive tech).
          Wording is generic on purpose: the exact stage counts, TDS and recovery
          of a real unit are never stated here — those live in the catalogue. */}
      <div className="kitchen-chips" aria-hidden="true">
        <motion.div className="kitchen-chip kitchen-chip-tds" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9, duration: 0.6 }}>
          <span className="kitchen-chip-k">WATER</span>
          <span className="kitchen-chip-v">Purified</span>
        </motion.div>
        <motion.div className="kitchen-chip kitchen-chip-ro" initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.05, duration: 0.6 }}>
          <span className="kitchen-chip-k">SERVICE</span>
          <span className="kitchen-chip-v">Navi Mumbai</span>
        </motion.div>
        <motion.div className="kitchen-chip kitchen-chip-home" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6 }}>
          <span className="kitchen-chip-k">Fitted</span>
          <span className="kitchen-chip-v">Under Counter</span>
        </motion.div>
      </div>
    </div>
  );
};

export default KitchenHero3D;
