import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductComparison from '../components/ProductComparison';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { apiService } from '../services/api';
import { mapProduct } from '../utils/helpers';

// Offline fallback used only when the API/DB is unreachable
const fallbackProducts = [
  { id: '1', name: 'Aqua Innovica', brand: 'Aqua Innovica', price: 15999, mrp: 19999, category: 'domestic-ro', technology: '3-in-1 Zinc + Copper + Alkaline', storageCapacity: '9L', shortDesc: 'Compact 9L premium purifier with 3-in-1 Zinc, Copper & Alkaline advanced filtration', specs: { filtrationStages: 8, warranty: '1 Year Warranty', inputTDS: '' }, features: ['Compact Design', '9 Litre Storage', 'Multi Stage Purification'], variants: [{ colorCode: '#7986cb', colorName: 'Blue Lavender', image: '/images/products/9e33eada-a2e3-42d2-b26d-e37f9d642c59.jfif' }] },
  { id: '2', name: 'AquaX Swift', brand: 'AquaX Series', price: 16999, mrp: 21999, category: 'domestic-ro', technology: 'RO + 3-in-1 Zinc/Copper/Alkaline', storageCapacity: '15L', shortDesc: 'Premium water purifier with 3-in-1 Zinc, Copper & Alkaline protection', specs: { filtrationStages: 12, warranty: '1 Year Warranty', inputTDS: '' }, features: ['3-in-1 Protection', 'Transparent Top Design'], variants: [{ colorCode: '#2d1810', colorName: 'Black & Copper', image: '/images/products/1fc212e0-6eb4-4395-97ad-fac0cefe7ad6.jfif' }] },
  { id: '3', name: 'Purella', brand: 'Purella', price: 7999, mrp: 10999, category: 'uv-purifier', technology: 'UV Purification', storageCapacity: 'Tankless (Inline)', shortDesc: '3-stage UV residential water system with 5L/min flow rate', specs: { filtrationStages: 3, warranty: '1 Year Warranty', inputTDS: 'Below 500 TDS' }, features: ['UV Purification', '5L Per Minute Flow Rate'], variants: [{ colorCode: '#37474f', colorName: 'Black & Silver', image: '/images/products/WhatsApp Image 2026-10-02 at 3.05.14 PM.jpeg' }] }
];

const Products = ({ defaultCategory = 'all' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProducts({ limit: 100 });
        const list = (data?.products || []).map(mapProduct);
        if (cancelled) return;
        if (list.length > 0) {
          setProducts(list);
          setUsingFallback(false);
        } else {
          setProducts(fallbackProducts);
          setUsingFallback(true);
        }
      } catch (err) {
        if (cancelled) return;
        setProducts(fallbackProducts);
        setUsingFallback(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadProducts();
    return () => { cancelled = true; };
  }, []);

  const handleCompare = (product) => {
    if (compareList.some(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 products at a time.");
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  const filteredProducts = products.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch = (p.name || '').toLowerCase().includes(term) || (p.brand || '').toLowerCase().includes(term);
    const matchCategory = category === 'all' || p.category === category;
    
    let matchPrice = true;
    if (priceRange === 'under10') matchPrice = p.price < 10000;
    if (priceRange === '10to15') matchPrice = p.price >= 10000 && p.price <= 15000;
    if (priceRange === '15to20') matchPrice = p.price > 15000 && p.price <= 20000;
    if (priceRange === 'above20') matchPrice = p.price > 20000;

    return matchSearch && matchCategory && matchPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name-a') return a.name.localeCompare(b.name);
    return 0; // default
  });

  return (
    <div className="page-enter-active">
      <section className="py-4 bg-secondary bg-opacity-10 border-bottom">
        <div className="container mt-4">
          <h1 className="fw-bold mb-0">Our Products</h1>
          <p className="text-muted mb-0">Explore our range of premium water purifiers.</p>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-lg-3 col-md-6">
              <div className="position-relative">
                <FiSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <input 
                  type="text" 
                  className="form-control ps-5 rounded-pill" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <select className="form-select rounded-pill" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="domestic-ro">Domestic RO</option>
                <option value="uv-purifier">UV Purifiers</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-6">
              <select className="form-select rounded-pill" value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                <option value="all">All Prices</option>
                <option value="under10">Under ₹10,000</option>
                <option value="10to15">₹10,000 - ₹15,000</option>
                <option value="15to20">₹15,000 - ₹20,000</option>
                <option value="above20">Above ₹20,000</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-6">
              <select className="form-select rounded-pill" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Sort By: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-a">Name: A to Z</option>
              </select>
            </div>
          </div>

          {usingFallback && !loading && (
            <div className="alert alert-warning py-2 small rounded-3" role="alert">
              Showing sample catalogue — live product data is unavailable (backend/database not connected).
            </div>
          )}

          {loading ? (
            <div className="row g-4">
              {[1,2,3,4].map(n => (
                <div key={n} className="col-md-6 col-lg-3">
                  <div className="card border-0 shadow-sm rounded-4 h-100 placeholder-glow">
                    <div className="placeholder w-100" style={{ height: '200px' }}></div>
                    <div className="card-body">
                      <div className="placeholder w-50 mb-2"></div>
                      <div className="placeholder w-75 mb-4"></div>
                      <div className="placeholder w-100 mb-2"></div>
                      <div className="placeholder w-100"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5 bg-card rounded-4 border">
              <FiFilter size={48} className="text-muted mb-3" />
              <h4 className="fw-bold">No Products Found</h4>
              <p className="text-secondary">Try adjusting your search or filter criteria.</p>
              <button className="btn btn-outline-primary rounded-pill mt-2" onClick={() => { setSearchTerm(''); setCategory('all'); setPriceRange('all'); }}>Clear Filters</button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="col-md-6 col-lg-3 col-sm-6">
                  <ProductCard product={product} onCompare={handleCompare} compareList={compareList} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sticky Compare Bar */}
      {compareList.length > 0 && (
        <div className="position-fixed bottom-0 start-0 w-100 bg-card border-top shadow-lg p-3 z-3 animate-fade-up">
          <div className="container d-flex justify-content-between align-items-center">
            <div>
              <span className="fw-bold me-3 d-none d-md-inline">Compare Products ({compareList.length}/3)</span>
              <div className="d-flex gap-2 d-inline-flex">
                {compareList.map(p => (
                  <span key={p.id} className="badge bg-secondary bg-opacity-10 text-dark border p-2">
                    {p.name} <button className="btn-close ms-2" style={{ fontSize: '0.5rem' }} onClick={() => handleCompare(p)}></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary btn-sm rounded-pill d-none d-md-inline-block" onClick={() => setCompareList([])}>Clear All</button>
              <button className="btn btn-primary rounded-pill px-4" onClick={() => setShowCompare(true)} disabled={compareList.length < 2}>
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-card border-0 rounded-4">
              <div className="modal-header border-bottom border-secondary border-opacity-25 p-4">
                <h5 className="modal-title fw-bold">Compare Products</h5>
                <button type="button" className="btn-close" onClick={() => setShowCompare(false)}></button>
              </div>
              <div className="modal-body p-4">
                <ProductComparison products={compareList} onRemove={handleCompare} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
