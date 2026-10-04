import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const ThemeSwitcher = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className={`btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center ${className}`}
      style={{ width: '40px', height: '40px' }}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </button>
  );
};

export default ThemeSwitcher;
