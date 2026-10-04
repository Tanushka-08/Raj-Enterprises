import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheck, FiShield, FiDroplet } from 'react-icons/fi';
import ProductViewer from '../components/ProductViewer';
import ProductEnquiryForm from '../components/ProductEnquiryForm';
import { apiService } from '../services/api';
import { formatPrice, mapProduct } from '../utils/helpers';
import ScrollReveal from '../components/ScrollReveal';

// Offline fallback used only when the API/DB is unreachable
const fallbackProduct = {
  id: '1',
  name: 'Aqua Innovica',
  brand: 'Aqua Innovica',
  price: 15999,
  mrp: 19999,
  shortDesc: 'Compact 9L premium purifier with 3-in-1 Zinc, Copper & Alkaline advanced filtration.',
  technology: '3-in-1 Zinc + Copper + Alkaline',
  storageCapacity: '9 Litres',
  specs: { filtrationStages: 8, warranty: '1 Year Warranty', purificationType: 'RO, UV, UF' },
  features: ['Compact Design — Saves Space', '9 Litre Storage', 'Multi Stage Purification', 'Advanced Filtration — Zinc Copper Alkaline', 'Power ON/OFF, Tank Full, Purifying Indicators'],
  variants: [
    { colorCode: '#7986cb', colorName: 'Blue Lavender', image: '/images/products/9e33eada-a2e3-42d2-b26d-e37f9d642c59.jfif' },
    { colorCode: '#fafafa', colorName: 'Pearl White', image: '/images/products/bac6eb02-6f6a-4ad0-ab69-0b1581acb4a7.jfif' }
  ]
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await apiService.getProductById(id);
        if (!cancelled) setProduct(mapProduct(data));
      } catch (err) {
        if (!cancelled) setProduct(fallbackProduct);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (id) loadProduct();
    else setLoading(false);
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <div className="container py-5 text-center mt-5"><div className="spinner-border text-primary mt-5"></div></div>;
  }

  if (!product) {
    return <div className="container py-5 text-center mt-5"><h4>Product not found</h4><Link to="/products" className="btn btn-primary mt-3">Back to Products</Link></div>;
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="page-enter-active">
      {/* Breadcrumb */}
      <div className="bg-secondary bg-opacity-10 py-2 border-bottom">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none">Products</Link></li>
              <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row g-5">
            {/* Left: Product Viewer */}
            <div className="col-lg-6">
              <ScrollReveal direction="left">
                <ProductViewer variants={product.variants} />
              </ScrollReveal>
            </div>

            {/* Right: Product Info */}
            <div className="col-lg-6">
              <ScrollReveal direction="right">
                <div className="mb-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 me-2">{product.brand}</span>
                  {discount > 0 && <span className="badge bg-danger">{discount}% OFF</span>}
                </div>
                
                <h1 className="fw-bold mb-3">{product.name}</h1>
                <p className="lead text-secondary mb-4">{product.shortDesc}</p>
                
                <div className="d-flex align-items-end mb-4 pb-4 border-bottom">
                  <h2 className="display-5 fw-bold text-accent mb-0 me-3">{formatPrice(product.price)}</h2>
                  {product.mrp > product.price && (
                    <span className="fs-4 text-muted text-decoration-line-through mb-1">{formatPrice(product.mrp)}</span>
                  )}
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <div className="bg-secondary bg-opacity-10 p-2 rounded me-3 text-primary"><FiDroplet size={24}/></div>
                      <div>
                        <small className="text-muted d-block">Technology</small>
                        <span className="fw-medium">{product.technology}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center">
                      <div className="bg-secondary bg-opacity-10 p-2 rounded me-3 text-primary"><FiShield size={24}/></div>
                      <div>
                        <small className="text-muted d-block">Storage</small>
                        <span className="fw-medium">{product.storageCapacity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 mb-5">
                  <Link to={`/book-service?type=Installation&product=${encodeURIComponent(product.name)}`} className="btn btn-primary btn-lg rounded-pill btn-shine">
                    Book Installation
                  </Link>
                </div>

                {/* Enquiry form — saves straight to the enquiries inbox */}
                <ScrollReveal direction="up">
                  <ProductEnquiryForm product={product} />
                </ScrollReveal>

                {/* Key Features */}
                <h5 className="fw-bold mb-3">Key Features</h5>
                <ul className="list-unstyled mb-0 row g-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="col-sm-6 d-flex align-items-start">
                      <FiCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span className="text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-5 bg-secondary bg-opacity-10 border-top">
        <div className="container py-4">
          <h3 className="fw-bold mb-4 text-center">Technical Specifications</h3>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-card rounded-4 shadow-sm border overflow-hidden">
                <table className="table table-borderless mb-0">
                  <tbody>
                    {Object.entries(product.specs).map(([key, value], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? 'bg-secondary bg-opacity-10' : ''}>
                        <th className="w-50 ps-4 py-3 text-muted fw-medium text-capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</th>
                        <td className="w-50 pe-4 py-3 fw-medium">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
