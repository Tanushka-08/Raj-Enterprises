import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FiRotateCw, FiRefreshCw, FiMove, FiMaximize2 } from 'react-icons/fi';

// Angle presets: front / three-quarter left / three-quarter right / slight top.
// Only CSS 3D transforms are used, so the real catalogue photograph is never
// altered, stretched or replaced — it is the same image the shop sells.
const VIEWS = [
  { id: 'front', label: 'Front', x: 0, y: 0 },
  { id: 'left', label: 'Left', x: 0, y: -26 },
  { id: 'right', label: 'Right', x: 0, y: 26 },
  { id: 'top', label: 'Top View', x: -14, y: 12 }
];

const ProductViewer = ({ variants, defaultVariantIdx = 0, productName = '' }) => {
  const [activeIdx, setActiveIdx] = useState(defaultVariantIdx);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const stageRef = useRef(null);
  const dragState = useRef({ startX: 0, startY: 0, baseY: 0, baseX: 0, pointerId: null });

  const activeVariant = variants?.[activeIdx];

  // Reset the turntable when the visitor switches colour/variant
  useEffect(() => {
    setRotation({ x: 0, y: 0 });
    setSpinning(false);
  }, [activeIdx]);

  const onPointerDown = (e) => {
    if (!activeVariant?.image) return;
    setDragging(true);
    setSpinning(false);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      baseY: rotation.y,
      baseX: rotation.x,
      pointerId: e.pointerId
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const { startX, startY, baseY, baseX } = dragState.current;
    const nextY = baseY + (e.clientX - startX) * 0.42;
    const nextX = Math.max(-38, Math.min(38, baseX - (e.clientY - startY) * 0.28));
    setRotation({ x: nextX, y: nextY });
  };

  const endDrag = (e) => {
    if (!dragging) return;
    setDragging(false);
    if (e?.pointerId != null) e.currentTarget?.releasePointerCapture?.(e.pointerId);
  };

  // Gentle hover tilt when the pointer is over the stage (desktop only feel)
  const onHoverMove = useCallback((e) => {
    if (dragging || spinning || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setRotation({ x: -py * 12, y: px * 20 });
  }, [dragging, spinning]);

  const resetView = () => {
    setSpinning(false);
    setRotation({ x: 0, y: 0 });
  };

  const toggleSpin = () => {
    if (spinning) {
      setSpinning(false);
      setRotation({ x: 0, y: 0 });
      return;
    }
    setDragging(false);
    setSpinning(true);
  };

  if (!variants || variants.length === 0) {
    return <div className="bg-secondary bg-opacity-10 rounded p-5 text-center">No image available</div>;
  }

  const style = {
    transform: `perspective(1600px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    animation: spinning ? 'viewerSpin 9s linear infinite' : undefined
  };

  return (
    <div>
      <div
        ref={stageRef}
        className={`viewer-stage ${dragging ? 'is-dragging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => (dragging ? onPointerMove(e) : onHoverMove(e))}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => { if (dragging) setDragging(false); else setRotation({ x: 0, y: 0 }); }}
        role="img"
        aria-label={`${productName || activeVariant?.colorName || 'Product'} — 3D view. Drag or use the angle buttons to rotate.`}
      >
        <div className="viewer-unit" style={style}>
          <div className="viewer-reflection" aria-hidden="true" />
          {activeVariant?.image ? (
            <div className="viewer-image">
              <img src={activeVariant.image} alt={activeVariant.colorName || productName} draggable="false" />
            </div>
          ) : (
            <div className="text-muted py-5">Image Placeholder</div>
          )}
        </div>

        <span className="viewer-hint">
          <FiMove /> Drag to rotate · swipe on mobile
        </span>
      </div>

      {/* angle presets + auto spin */}
      <div className="viewer-controls">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            type="button"
            className={`viewer-btn ${!spinning && rotation.x === view.x && rotation.y === view.y ? 'is-on' : ''}`}
            onClick={() => { setSpinning(false); setRotation({ x: view.x, y: view.y }); }}
          >
            {view.label}
          </button>
        ))}
        <button type="button" className={`viewer-btn ${spinning ? 'is-spinning' : ''}`} onClick={toggleSpin}>
          <FiRotateCw /> {spinning ? 'Stop' : 'Auto Rotate'}
        </button>
        <button type="button" className="viewer-btn" onClick={resetView}>
          <FiRefreshCw /> Reset
        </button>
      </div>

      {variants.length > 1 && (
        <div className="viewer-controls">
          {variants.map((v, idx) => (
            <button
              key={idx}
              type="button"
              className={`viewer-swatch ${activeIdx === idx ? 'is-active' : ''}`}
              onClick={() => setActiveIdx(idx)}
              title={v.colorName}
              aria-label={`Show ${v.colorName || `variant ${idx + 1}`}`}
              aria-pressed={activeIdx === idx}
            >
              <span style={{ backgroundColor: v.colorCode || 'var(--bg-tertiary)' }} />
            </button>
          ))}
        </div>
      )}

      <div className="text-center mt-2 text-muted small d-flex align-items-center justify-content-center gap-2">
        {activeVariant?.colorName}
        <span className="d-none d-sm-inline">
          <FiMaximize2 style={{ fontSize: '0.85rem' }} />
        </span>
      </div>
    </div>
  );
};

export default ProductViewer;
