import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiTool, FiCheckCircle, FiClipboard, FiPhone, FiMail, FiMapPin,
  FiMessageCircle, FiBell, FiCopy, FiCheck, FiShield
} from 'react-icons/fi';
import {
  validateMobile, validatePincode, validateEmail, validateRequired, validateName, validateDate
} from '../utils/validators';
import { apiService } from '../services/api';
import { normalizeServiceType, generateWhatsAppLink, generateCallLink, buildBookingMessage, BUSINESS_PHONE } from '../utils/helpers';
import { useToast } from '../context/ToastContext';

const SERVICE_OPTIONS = [
  { value: 'RO Installation', label: 'RO Installation', icon: FiTool },
  { value: 'RO Repair', label: 'RO Repair', icon: FiTool },
  { value: 'RO Servicing', label: 'RO Servicing', icon: FiCheckCircle },
  { value: 'Filter Replacement', label: 'Filter Change', icon: FiRefreshIcon },
  { value: 'AMC', label: 'AMC Plan', icon: FiShield },
  { value: 'Water Treatment', label: 'Water Treatment', icon: FiTool },
  { value: 'Water Testing', label: 'Water Testing', icon: FiCheckCircle },
  { value: 'Other', label: 'Something else', icon: FiMessageCircle }
];

// Small inline icon so the list has no extra import
function FiRefreshIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

const BookingForm = () => {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    addressType: 'Residential',
    address: '',
    pincode: '',
    serviceType: '',
    preferredDate: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Default to tomorrow so the field is never empty or in the past
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({ ...prev, preferredDate: tomorrow.toISOString().split('T')[0] }));
  }, []);

  useEffect(() => {
    // Prefill from links like /book-service?type=AMC&plan=... or ?type=Installation&product=...
    const typeParam = searchParams.get('type');
    const productParam = searchParams.get('product');
    const planParam = searchParams.get('plan');
    if (!typeParam && !productParam && !planParam) return;

    setFormData(prev => ({
      ...prev,
      serviceType: typeParam ? normalizeServiceType(typeParam) : prev.serviceType,
      message: planParam
        ? `AMC plan enquiry: ${planParam}`
        : (productParam ? `Product enquiry: ${productParam}` : prev.message)
    }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Restrict the date picker to today onwards (matches the server-side check)
  const minDate = new Date().toISOString().split('T')[0];

  const validateForm = () => {
    const newErrors = {};
    if (!validateRequired(formData.name) || !validateName(formData.name)) newErrors.name = 'Valid name is required';
    if (!validateRequired(formData.mobile) || !validateMobile(formData.mobile)) newErrors.mobile = 'Valid 10-digit mobile number is required';
    if (formData.email && !validateEmail(formData.email)) newErrors.email = 'Valid email is required';
    if (!validateRequired(formData.address)) newErrors.address = 'Address is required';
    if (!validateRequired(formData.pincode) || !validatePincode(formData.pincode)) newErrors.pincode = 'Valid 6-digit pincode is required';
    if (!validateRequired(formData.serviceType)) newErrors.serviceType = 'Please select a service type';
    if (!validateRequired(formData.preferredDate) || !validateDate(formData.preferredDate)) newErrors.preferredDate = 'Please select a valid future date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      customerName: formData.name.trim(),
      mobile: formData.mobile.trim(),
      address: formData.address.trim(),
      pincode: formData.pincode.trim(),
      customerType: formData.addressType === 'Commercial' ? 'commercial' : 'residential',
      serviceType: formData.serviceType,
      preferredDate: formData.preferredDate,
      message: formData.message
    };
    if (validateRequired(formData.email)) payload.email = formData.email.trim();

    try {
      const res = await apiService.createServiceRequest(payload);
      const ticket = res?.ticketId || res?.data?.ticketId;
      setSuccessTicket({
        id: ticket,
        name: payload.customerName,
        mobile: payload.mobile,
        service: payload.serviceType,
        address: payload.address,
        preferredDate: payload.preferredDate
      });
      toast.success(`Service request registered. Ticket ID: ${ticket}`, 6000);
    } catch (error) {
      const apiMsg = error?.response?.data?.errors?.[0]?.msg || error?.response?.data?.message;
      const msg = apiMsg || 'Could not submit your request. Please try again or call 8237739994.';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copying the ticket into the clipboard is the one "reminder" we can make
  // genuinely reliable without an SMS gateway.
  const copyTicket = async () => {
    try {
      await navigator.clipboard.writeText(successTicket.id);
      setCopied(true);
      toast.success('Ticket ID copied. Paste it in your phone notes for quick tracking.');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Could not copy automatically. Please note the Ticket ID manually.');
    }
  };

  const reminderMessage = successTicket
    ? buildBookingMessage({
        ticketId: successTicket.id,
        name: successTicket.name,
        serviceType: successTicket.service,
        mobile: successTicket.mobile,
        address: successTicket.address,
        preferredDate: successTicket.preferredDate
      })
    : '';

  if (successTicket) {
    return (
      <motion.div
        className="booking-panel booking-success"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.5, type: 'spring', stiffness: 220, damping: 16 }}
        >
          <FiCheckCircle size={62} className="text-success" />
        </motion.div>

        <h2 className="fw-bold mt-3 mb-2">Request Registered</h2>
        <p className="text-secondary mb-4">
          Thank you {successTicket.name}. Our team will call you on {successTicket.mobile} to confirm the visit.
        </p>

        <div className="ticket-receipt mb-4">
          <p className="text-muted small mb-1 text-uppercase" style={{ letterSpacing: '0.12em' }}>Your Ticket ID</p>
          <div className="ticket-receipt-value">{successTicket.id}</div>
        </div>

        {/* Practical, non-fake follow-up: the channels the business already has */}
        <div className="reminder-list mx-auto mb-4" style={{ maxWidth: 560 }}>
          <div className="reminder-item">
            <FiBell className="contact-line-icon" />
            <p>
              <strong>Keep this Ticket ID.</strong> Use it on the Track Service page with your mobile number
              to see the live status — every technician update appears there.
            </p>
          </div>
          <div className="reminder-item">
            <FiMessageCircle className="contact-line-icon" />
            <p>
              <strong>Want it on WhatsApp?</strong> Send us the details in one tap from your own WhatsApp —
              this opens a prefilled message for you to send.
            </p>
          </div>
          <div className="reminder-item">
            <FiShield className="contact-line-icon" />
            <p>
              <strong>Urgent?</strong> Call {BUSINESS_PHONE} directly for same-day installation or repair.
            </p>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
          <button type="button" className="btn btn-primary rounded-pill px-4 btn-shine" onClick={copyTicket}>
            {copied ? <FiCheck className="me-2" /> : <FiCopy className="me-2" />}
            {copied ? 'Copied' : 'Copy Ticket ID'}
          </button>
          <a
            href={generateWhatsAppLink(BUSINESS_PHONE, reminderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp rounded-pill px-4 btn-shine"
          >
            <FiMessageCircle className="me-2" /> Send on WhatsApp
          </a>
          <a href={generateCallLink(BUSINESS_PHONE)} className="btn btn-outline-primary rounded-pill px-4 bg-card">
            <FiPhone className="me-2" /> Call Now
          </a>
        </div>

        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <Link to="/track-service" className="btn btn-outline-primary rounded-pill px-4">
            Track This Request
          </Link>
          <Link to="/products" className="btn btn-link text-decoration-none px-4">
            Continue Browsing
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="booking-panel-body" noValidate>
      {submitError && <div className="alert alert-danger py-2 small">{submitError}</div>}

      <div className="row g-3">
        <div className="col-md-6 booking-field">
          <label className="booking-label" htmlFor="name">Full Name <span className="req">*</span></label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="col-md-6 booking-field">
          <label className="booking-label" htmlFor="mobile">Mobile Number <span className="req">*</span></label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
            id="mobile"
            name="mobile"
            placeholder="10-digit mobile"
            value={formData.mobile}
            onChange={handleChange}
            autoComplete="tel"
          />
          {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
        </div>

        <div className="col-md-6 booking-field">
          <label className="booking-label" htmlFor="email">Email Address <span className="text-muted fw-normal">(optional)</span></label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="col-md-6 booking-field">
          <label className="booking-label" htmlFor="addressType">Property Type</label>
          <select className="form-select" id="addressType" name="addressType" value={formData.addressType} onChange={handleChange}>
            <option value="Residential">Residential (Flat / House)</option>
            <option value="Commercial">Commercial (Office / Shop)</option>
          </select>
        </div>

        <div className="col-12 booking-field">
          <label className="booking-label" htmlFor="address">Complete Address <span className="req">*</span></label>
          <textarea
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            id="address"
            name="address"
            rows={3}
            placeholder="Flat / House no., Building, Sector, Landmark"
            value={formData.address}
            onChange={handleChange}
            autoComplete="street-address"
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          <p className="booking-hint">We use this only to reach you for this service visit.</p>
        </div>

        <div className="col-md-4 booking-field">
          <label className="booking-label" htmlFor="pincode">Pincode <span className="req">*</span></label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
            id="pincode"
            name="pincode"
            placeholder="400703"
            value={formData.pincode}
            onChange={handleChange}
            autoComplete="postal-code"
          />
          {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
        </div>

        <div className="col-md-6 booking-field">
          <label className="booking-label" htmlFor="preferredDate">Preferred Date <span className="req">*</span></label>
          <input
            type="date"
            min={minDate}
            className={`form-control ${errors.preferredDate ? 'is-invalid' : ''}`}
            id="preferredDate"
            name="preferredDate"
            value={formData.preferredDate}
            onChange={handleChange}
          />
          {errors.preferredDate && <div className="invalid-feedback">{errors.preferredDate}</div>}
          <p className="booking-hint">We confirm the exact visit time on call.</p>
        </div>

        {/* service picker */}
        <div className="col-12 booking-field">
          <span className="booking-label">Service Required <span className="req">*</span></span>
          <div className={`service-picker ${errors.serviceType ? 'is-invalid' : ''}`}>
            {SERVICE_OPTIONS.map((opt) => (
              <div className="service-option" key={opt.value}>
                <input
                  type="radio"
                  id={`svc-${opt.value.replace(/\s+/g, '-')}`}
                  name="serviceType"
                  value={opt.value}
                  checked={formData.serviceType === opt.value}
                  onChange={handleChange}
                />
                <label htmlFor={`svc-${opt.value.replace(/\s+/g, '-')}`}>
                  <opt.icon />
                  {opt.label}
                </label>
              </div>
            ))}
          </div>
          {errors.serviceType && <div className="invalid-feedback d-block">{errors.serviceType}</div>}
        </div>

        <div className="col-12 booking-field">
          <label className="booking-label" htmlFor="message">Issue / Instructions <span className="text-muted fw-normal">(optional)</span></label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows={3}
            placeholder="e.g. Water TDS reading is high and the purifier is 2 years old"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pt-2">
            <p className="text-muted small mb-0">
              <FiShield className="me-1" />
              Your details stay with Raj Enterprises. No payment is taken online.
            </p>
            <button type="submit" className="btn btn-primary btn-lg rounded-pill px-5 btn-shine hover-glow" disabled={isSubmitting}>
              <FiClipboard className="me-2" />
              {isSubmitting ? 'Registering...' : 'Register Service Request'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

const BookingAside = () => (
  <div className="booking-rail">
    <div className="booking-card booking-card-accent">
      <h4 className="fw-bold mb-4">How it works</h4>
      <ul className="booking-steps">
        {[
          'Fill out the service details',
          'Get your unique Ticket ID instantly',
          'We assign a technician',
          'Service delivered at your doorstep'
        ].map((step, idx) => (
          <li key={idx}>
            <span className="booking-step-num">{idx + 1}</span>
            <span className="booking-step-text">{step}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="booking-card">
      <h5 className="fw-bold mb-2">Need help booking?</h5>
      <p className="text-muted small mb-1">Call, WhatsApp or email us — we reply during business hours.</p>
      <div className="contact-line">
        <FiPhone size={18} className="contact-line-icon" />
        <div>
          <small>Call / WhatsApp</small>
          <a href={generateCallLink(BUSINESS_PHONE)} className="fw-medium text-decoration-none">{BUSINESS_PHONE}</a>
        </div>
      </div>
      <div className="contact-line">
        <FiMessageCircle size={18} className="contact-line-icon" />
        <div>
          <small>WhatsApp</small>
          <a
            href={generateWhatsAppLink(BUSINESS_PHONE, 'Hi Raj Enterprises! I need help booking a service.')}
            target="_blank"
            rel="noopener noreferrer"
            className="fw-medium text-decoration-none"
          >
            Chat with us
          </a>
        </div>
      </div>
      <div className="contact-line">
        <FiMail size={18} className="contact-line-icon" />
        <div>
          <small>Email</small>
          <a href="mailto:aquarajenterprises@gmail.com" className="fw-medium text-decoration-none">aquarajenterprises@gmail.com</a>
        </div>
      </div>
      <div className="contact-line">
        <FiMapPin size={18} className="contact-line-icon" />
        <div>
          <small>Service area</small>
          <span className="fw-medium">Navi Mumbai</span>
        </div>
      </div>
    </div>
  </div>
);

export { BookingAside };
export default BookingForm;
