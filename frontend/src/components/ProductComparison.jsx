import React from 'react';
import { FiX, FiCheck, FiMinus } from 'react-icons/fi';
import { formatPrice } from '../utils/helpers';

const ProductComparison = ({ products, onRemove }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="table-responsive">
      <table className="table table-bordered bg-transparent align-middle">
        <thead className="table-light sticky-top">
          <tr>
            <th style={{ width: '20%' }}>Features</th>
            {products.map(p => (
              <th key={p.id} className="text-center position-relative" style={{ width: `${80 / products.length}%` }}>
                <button 
                  onClick={() => onRemove(p.id)} 
                  className="btn btn-sm btn-danger rounded-circle position-absolute top-0 end-0 m-1 p-1"
                  style={{ width: '24px', height: '24px', lineHeight: '1' }}
                  title="Remove"
                >
                  <FiX />
                </button>
                <div className="p-2">
                  <div style={{ height: '100px' }} className="d-flex align-items-center justify-content-center mb-2">
                    {p.variants?.[0]?.image ? (
                      <img src={p.variants[0].image} alt={p.name} className="img-fluid max-h-100" style={{ maxHeight: '100px' }} />
                    ) : (
                      <div className="bg-secondary rounded w-50 h-50 opacity-25"></div>
                    )}
                  </div>
                  <h6 className="mb-0 fw-bold">{p.name}</h6>
                  <small className="text-muted">{p.brand}</small>
                  <div className="text-accent fw-bold mt-1">{formatPrice(p.price)}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-start">
          <tr>
            <td className="fw-medium">Technology</td>
            {products.map(p => <td key={p.id}>{p.technology || <FiMinus className="text-muted" />}</td>)}
          </tr>
          <tr>
            <td className="fw-medium">Storage Capacity</td>
            {products.map(p => <td key={p.id}>{p.storageCapacity || <FiMinus className="text-muted" />}</td>)}
          </tr>
          <tr>
            <td className="fw-medium">Filtration Stages</td>
            {products.map(p => <td key={p.id}>{p.specs?.filtrationStages || <FiMinus className="text-muted" />}</td>)}
          </tr>
          <tr>
            <td className="fw-medium">Warranty</td>
            {products.map(p => <td key={p.id}>{p.specs?.warranty || <FiMinus className="text-muted" />}</td>)}
          </tr>
          <tr>
            <td className="fw-medium">Input TDS (Max)</td>
            {products.map(p => <td key={p.id}>{p.specs?.inputTDS || <FiMinus className="text-muted" />}</td>)}
          </tr>
          <tr>
            <td className="fw-medium">Features</td>
            {products.map(p => (
              <td key={p.id}>
                <ul className="list-unstyled mb-0 small">
                  {p.features?.slice(0,4).map((f, i) => (
                    <li key={i}><FiCheck className="text-success me-1"/>{f}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductComparison;
