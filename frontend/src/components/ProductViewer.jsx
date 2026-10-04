import React, { useState, useRef } from 'react';

const ProductViewer = ({ variants, defaultVariantIdx = 0 }) => {
  const [activeIdx, setActiveIdx] = useState(defaultVariantIdx);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const activeVariant = variants?.[activeIdx];

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  if (!variants || variants.length === 0) {
    return <div className="bg-secondary bg-opacity-10 rounded p-5 text-center">No image available</div>;
  }

  /* Note: True 3D requires WebGL/Three.js with 3D models. 
     This implements a premium 2D parallax tilt effect which gives depth perception. */
  const tiltStyle = isHovered ? {
    transform: `perspective(1000px) rotateY(${mousePos.x * 15}deg) rotateX(${-mousePos.y * 15}deg) scale3d(1.05, 1.05, 1.05)`,
    transition: 'transform 0.1s ease-out'
  } : {
    transform: 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease-out'
  };

  return (
    <div>
      <div 
        ref={containerRef}
        className="product-viewer-container glass-panel rounded-4 p-4 mb-4 d-flex align-items-center justify-content-center overflow-hidden"
        style={{ minHeight: '400px', cursor: 'zoom-in' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      >
        {activeVariant?.image ? (
          <img 
            src={activeVariant.image} 
            alt={activeVariant.colorName} 
            className="img-fluid"
            style={{ maxHeight: '350px', ...tiltStyle }}
          />
        ) : (
          <div style={{ ...tiltStyle }} className="text-muted">Image Placeholder</div>
        )}
      </div>

      {variants.length > 1 && (
        <div className="d-flex justify-content-center gap-3">
          {variants.map((v, idx) => (
            <button
              key={idx}
              className={`btn rounded-circle p-1 ${activeIdx === idx ? 'border-primary border-2 shadow' : 'border-secondary'}`}
              style={{ width: '40px', height: '40px', transition: 'all 0.2s' }}
              onClick={() => setActiveIdx(idx)}
              title={v.colorName}
            >
              <div 
                className="w-100 h-100 rounded-circle" 
                style={{ backgroundColor: v.colorCode }}
              />
            </button>
          ))}
        </div>
      )}
      <div className="text-center mt-2 text-muted small">
        {activeVariant?.colorName}
      </div>
    </div>
  );
};

export default ProductViewer;
