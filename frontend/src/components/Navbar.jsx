import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiPhone, FiMenu, FiX, FiDroplet } from 'react-icons/fi';
import ThemeSwitcher from './ThemeSwitcher';
import AccentColorSelector from './AccentColorSelector';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top custom-navbar ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
          <FiDroplet className="text-accent me-2 fs-4" />
          <span>Raj Enterprises</span>
        </NavLink>
        
        <div className="d-flex align-items-center d-lg-none">
          <ThemeSwitcher className="me-2" />
          <button className="navbar-toggler border-0 shadow-none" type="button" onClick={toggleMenu}>
            {menuOpen ? <FiX className="fs-3 text-primary" /> : <FiMenu className="fs-3 text-primary" />}
          </button>
        </div>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 text-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={closeMenu}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about" onClick={closeMenu}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products" onClick={closeMenu}>Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services" onClick={closeMenu}>Services</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/amc" onClick={closeMenu}>AMC</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/book-service" onClick={closeMenu}>Book Service</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/track-service" onClick={closeMenu}>Track Status</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact" onClick={closeMenu}>Contact</NavLink>
            </li>
          </ul>
          <div className="d-flex align-items-center justify-content-center mt-3 mt-lg-0 gap-3">
            <div className="d-none d-lg-block">
              <AccentColorSelector />
            </div>
            <div className="d-none d-lg-block">
              <ThemeSwitcher />
            </div>
            <a href="tel:8237739994" className="btn btn-outline-primary d-flex align-items-center rounded-pill px-4">
              <FiPhone className="me-2" />
              8237739994
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
