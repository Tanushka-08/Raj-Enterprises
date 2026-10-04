import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const defaultAccentColor = '#0077b6';

const toRgb = (hex) => {
  const raw = String(hex).replace('#', '').trim();
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const toHex = (rgb) => '#' + rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('');

// Relative luminance per WCAG 2.x
const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a, b) => {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
};

const mix = (hex, target, amount) => {
  const a = toRgb(hex);
  const b = toRgb(target);
  return toHex(a.map((c, i) => c + (b[i] - c) * amount));
};

// Nudge a colour towards black or white until it is readable on the given surface
const readableOn = (color, bg, min = 4.5) => {
  const target = luminance(bg) > 0.4 ? '#000000' : '#ffffff';
  for (let step = 0; step <= 1.001; step += 0.04) {
    const candidate = mix(color, target, step);
    if (contrast(candidate, bg) >= min) return candidate;
  }
  return target;
};

// Pick white or dark ink for text sitting on a filled accent background
const inkOn = (color) => {
  if (contrast('#ffffff', color) >= 4.5) return '#ffffff';
  if (contrast('#0a1628', color) >= 4.5) return '#0a1628';
  return '#000000';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState(defaultAccentColor);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColor = localStorage.getItem('accentColor') || defaultAccentColor;
    
    setTheme(savedTheme);
    setAccentColor(savedColor);
    applyTheme(savedTheme, savedColor);
  }, []);

  const applyTheme = (currentTheme, color) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);
    root.style.setProperty('--accent-color', color);
    // Rough calculation for light/dark variants of accent
    root.style.setProperty('--accent-light', adjustColor(color, 40));
    root.style.setProperty('--accent-dark', adjustColor(color, -40));
    root.style.setProperty('--accent-rgb', toRgb(color).join(', '));

    // The user can pick any accent, so derive the dependent shades from the
    // surfaces they actually sit on instead of hard-coding them. Pick the
    // surface with the worst contrast so the result is readable everywhere.
    const cs = getComputedStyle(root);
    const surfaces = ['--bg-primary', '--bg-secondary', '--bg-tertiary', '--card-bg', '--hero-glow']
      .map((p) => cs.getPropertyValue(p).trim())
      .filter((v) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v));
    const fallbackBg = currentTheme === 'dark' ? '#1b3054' : '#e9ecef';
    const worstSurface = surfaces.length
      ? surfaces.reduce((worst, c) => (contrast(color, c) < contrast(color, worst) ? c : worst), surfaces[0])
      : fallbackBg;
    const isDark = currentTheme === 'dark';
    const accentText = readableOn(color, worstSurface);
    root.style.setProperty('--accent-text', accentText);
    // Accent sitting directly on the page background (links, outline buttons,
    // accordion labels). In dark mode the brand blue only reaches ~2.8:1 on the
    // navy surfaces, so lighten it until it clears AA on the page background.
    const pageBg = cs.getPropertyValue('--bg-primary').trim() || (isDark ? '#0a1628' : '#ffffff');
    const accentInk = isDark ? readableOn(mix(color, '#ffffff', 0.55), pageBg) : accentText;
    root.style.setProperty('--accent-ink', accentInk);
    root.style.setProperty('--accent-hover', mix(accentText, isDark ? '#ffffff' : '#000000', 0.18));
    root.style.setProperty('--accent-on', inkOn(color));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, accentColor);
  };

  const updateAccentColor = (color) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
    applyTheme(theme, color);
  };

  // Helper to lighten/darken hex color slightly
  const adjustColor = (color, amount) => {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor: updateAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
