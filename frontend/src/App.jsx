import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import { ToastProvider } from './context/ToastContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import DomesticRO from './pages/DomesticRO';
import Services from './pages/Services';
import AMCPlans from './pages/AMCPlans';
import BookService from './pages/BookService';
import TrackService from './pages/TrackService';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <div className="app-container">
            <ScrollToTop />
            {!isAdminRoute && <Navbar />}

            <main className={!isAdminRoute ? 'main-content' : ''}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/domestic-ro" element={<DomesticRO />} />
                <Route path="/services" element={<Services />} />
                <Route path="/amc" element={<AMCPlans />} />
                <Route path="/book-service" element={<BookService />} />
                <Route path="/track-service" element={<TrackService />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <WhatsAppButton />}
          </div>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
