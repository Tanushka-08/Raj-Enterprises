import React, { useState, useRef, useEffect } from 'react';
import { FiDroplet, FiCheck } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const colors = [
  { name: 'Ocean Blue', hex: '#0077b6' },
  { name: 'Deep Blue', hex: '#1d4ed8' }
];

const AccentColorSelector = () => {
  const { accentColor, setAccentColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: '40px', height: '40px' }}
        title="Change Theme Color"
        aria-label="Change theme colour"
      >
        <FiDroplet size={20} style={{ color: accentColor, fill: accentColor }} />
      </button>

      {isOpen && (
        <div className="position-absolute end-0 mt-2 p-2 bg-card border rounded-3 shadow-sm d-flex gap-2" style={{ zIndex: 1000 }}>
          {colors.map(c => (
            <button
              key={c.hex}
              onClick={() => { setAccentColor(c.hex); setIsOpen(false); }}
              className="btn p-0 rounded-circle position-relative border border-secondary border-opacity-25"
              style={{ width: '30px', height: '30px', backgroundColor: c.hex }}
              title={c.name}
            >
              {accentColor === c.hex && (
                <FiCheck size={16} className="text-on-accent position-absolute top-50 start-50 translate-middle" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccentColorSelector;
