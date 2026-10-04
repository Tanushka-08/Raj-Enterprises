import React, { useState } from 'react';
import { FiSend, FiCheckCircle } from 'react-icons/fi';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

const ProductEnquiryForm = ({ product }) => {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', mobile: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) {
      next.mobile = 'Enter a valid 10-digit mobile number';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validate()) {
      if (Object.keys(errors).length) {
        toast.error('Please correct the highlighted fields.');
      }
      return;
    }

    setSubmitting(true);
    try {
      await apiService.createEnquiry({
        customerName: form.name.trim(),
        mobile: form.mobile.trim(),
        productName: product.name,
        message:
          form.message.trim() ||
          `I am interested in buying ${product.name} (${product.brand}). Please share more details.`,
        source: 'product-page'
      });

      setDone(true);
      setForm({ name: '', mobile: '', message: '' });
      toast.success(`Enquiry sent for ${product.name}. We will call you shortly.`, 5000);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Could not send your enquiry. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="enquiry-success" role="status">
        <FiCheckCircle className="enquiry-success-icon" size={46} />
        <h5 className="fw-bold mb-2">Enquiry Received</h5>
        <p className="text-muted small mb-0">
          Your enquiry for <strong>{product.name}</strong> has been saved. Our team will
          contact you on the number you provided.
        </p>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm rounded-pill mt-3"
          onClick={() => setDone(false)}
        >
          Send Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="product-enquiry-form">
      <h5 className="fw-bold mb-1">Enquire about this product</h5>
      <p className="text-muted small mb-4">
        Send your details and we will get back to you with availability and pricing.
      </p>

      <div className="mb-3">
        <label htmlFor="enq-name" className="form-label small fw-medium mb-1">
          Your Name *
        </label>
        <input
          id="enq-name"
          name="name"
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="enq-mobile" className="form-label small fw-medium mb-1">
          Mobile Number *
        </label>
        <input
          id="enq-mobile"
          name="mobile"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
          placeholder="10-digit mobile number"
          value={form.mobile}
          onChange={handleChange}
          autoComplete="tel"
        />
        {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="enq-message" className="form-label small fw-medium mb-1">
          Message
        </label>
        <textarea
          id="enq-message"
          name="message"
          rows={3}
          className="form-control"
          placeholder={`I am interested in ${product.name}...`}
          value={form.message}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary rounded-pill w-100 btn-shine"
        disabled={submitting}
      >
        <FiSend className="me-2" />
        {submitting ? 'Sending...' : 'Send Enquiry'}
      </button>
    </form>
  );
};

export default ProductEnquiryForm;