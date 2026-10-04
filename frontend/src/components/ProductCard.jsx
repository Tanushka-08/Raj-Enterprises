import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiInfo, FiPlus } from 'react-icons/fi';
import { formatPrice, getDiscountPercentage, generateWhatsAppLink } from '../utils/helpers';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ProductCard = ({ product, onCompare, compareList = [] }) => {
  const [ref, isVisible] = useScrollReveal();
  const [activeVariant, setActiveVariant] = useState(product?.variants?.[0] || null);

  if (!product) return null;

  const isCompared = compareList.some(p => p.id === product.id);
  const discount = getDiscountPercentage(product.mrp, product.price);

  return (
    <div 
      ref={ref} 
      className={`product-card d-flex flex-column h-100 hover-lift ${isVisible ? 'animate-fade-up' : 'reveal-hidden'}`}
    >
      <div className="product-img-wrapper position-relative hover-zoom">
        {discount > 0 && (
          <span className="badge bg-danger position-absolute top-0 start-0 m-3 z-1">
            {discount}% OFF
          </span>
        )}
        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {activeVariant?.image ? (
            <img src={activeVariant.image} alt={product.name} className="product-img img-fluid" />
          ) : (
            <div className="bg-secondary bg-opacity-25 w-100 h-100 d-flex align-items-center justify-content-center rounded">
              No Image
            </div>
          )}
        </div>
      </div>

      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-muted text-uppercase fw-bold">{product.brand}</small>
          {product.variants && product.variants.length > 1 && (
            <div className="d-flex gap-1">
              {product.variants.map((v, idx) => (
                <button
                  key={idx}
                  className={`btn p-0 rounded-circle border ${activeVariant?.colorCode === v.colorCode ? 'border-dark shadow-sm' : 'border-light'}`}
                  style={{ width: '16px', height: '16px', backgroundColor: v.colorCode }}
                  onClick={() => setActiveVariant(v)}
                  aria-label={`Select ${v.colorName}`}
                />
              ))}
            </div>
          )}
        </div>
        
        <h5 className="fw-bold mb-1 text-truncate">{product.name}</h5>
        <p className="text-secondary small mb-3 text-truncate" title={product.shortDesc}>
          {product.shortDesc}
        </p>

        <div className="mb-3 d-flex flex-wrap gap-1">
          <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">
            {product.technology}
          </span>
          <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25">
            {product.storageCapacity}
          </span>
        </div>

        <div className="mt-auto">
          <div className="d-flex align-items-end mb-3">
            <h4 className="fw-bold text-accent mb-0 me-2">{formatPrice(product.price)}</h4>
            {product.mrp > product.price && (
              <small className="text-muted text-decoration-line-through mb-1">{formatPrice(product.mrp)}</small>
            )}
          </div>

          <div className="d-grid gap-2">
            <Link to={`/products/${product.id}`} className="btn btn-outline-primary btn-sm rounded-pill">
              <FiInfo className="me-1" /> View Details
            </Link>
            <div className="d-flex gap-2">
              <a 
                href={generateWhatsAppLink('8237739994', `Hi, I want to enquire about ${product.name} (${product.brand}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm flex-grow-1 rounded-pill"
              >
                Enquire Now
              </a>
              {onCompare && (
                <button 
                  onClick={() => onCompare(product)}
                  className={`btn btn-sm rounded-pill ${isCompared ? 'btn-secondary text-white' : 'btn-outline-secondary'}`}
                  title={isCompared ? "Remove from comparison" : "Add to compare"}
                >
                  {isCompared ? <FiCheck /> : <FiPlus />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
