import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { validateMobile, validatePincode, validateEmail, validateRequired, validateName, validateDate } from '../utils/validators';
import { apiService } from '../services/api';
import { normalizeServiceType } from '../utils/helpers';
import { FiCheckCircle } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

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

  useEffect(() => {
    // Set default date to tomorrow
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
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

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
      setSuccessTicket(ticket);
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

  if (successTicket) {
    return (
      <div className="text-center py-5">
        <FiCheckCircle className="text-success mb-4" size={80} />
        <h3 className="fw-bold mb-3">Booking Successful!</h3>
        <p className="lead mb-4">Your service request has been registered.</p>
        <div className="bg-light p-4 rounded-3 d-inline-block mb-4 border">
          <p className="text-muted mb-1">Ticket ID</p>
          <h4 className="fw-bold text-primary mb-0">{successTicket}</h4>
        </div>
        <p className="text-muted mb-4">Please save this Ticket ID to track your service status.</p>
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <Link to="/track-service" className="btn btn-primary rounded-pill px-4 btn-shine">
            Track This Request
          </Link>
          <Link to="/products" className="btn btn-outline-primary rounded-pill px-4">
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      {submitError && <div className="alert alert-danger py-2 small">{submitError}</div>}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} />
            <label htmlFor="name">Full Name</label>
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input type="tel" className={`form-control ${errors.mobile ? 'is-invalid' : ''}`} id="mobile" name="mobile" placeholder="9876543210" value={formData.mobile} onChange={handleChange} />
            <label htmlFor="mobile">Mobile Number</label>
            {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="email" name="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} />
            <label htmlFor="email">Email Address (Optional)</label>
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating mb-3">
            <select className="form-select" id="addressType" name="addressType" value={formData.addressType} onChange={handleChange}>
              <option value="Residential">Residential (Flat/House)</option>
              <option value="Commercial">Commercial (Office/Shop)</option>
            </select>
            <label htmlFor="addressType">Property Type</label>
          </div>
        </div>
        <div className="col-12">
          <div className="form-floating mb-3">
            <textarea className={`form-control ${errors.address ? 'is-invalid' : ''}`} id="address" name="address" placeholder="Address" style={{ height: '100px' }} value={formData.address} onChange={handleChange}></textarea>
            <label htmlFor="address">Complete Address</label>
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating mb-3">
            <input type="text" className={`form-control ${errors.pincode ? 'is-invalid' : ''}`} id="pincode" name="pincode" placeholder="400706" value={formData.pincode} onChange={handleChange} />
            <label htmlFor="pincode">Pincode</label>
            {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating mb-3">
            <select className={`form-select ${errors.serviceType ? 'is-invalid' : ''}`} id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange}>
              <option value="">Select Service</option>
              <option value="RO Installation">RO Installation</option>
              <option value="RO Repair">RO Repair</option>
              <option value="RO Servicing">RO Servicing</option>
              <option value="Filter Replacement">Filter Replacement</option>
              <option value="AMC">AMC Request</option>
              <option value="Water Treatment">Water Treatment</option>
              <option value="Water Testing">Water Testing</option>
              <option value="Other">Other</option>
            </select>
            <label htmlFor="serviceType">Service Required</label>
            {errors.serviceType && <div className="invalid-feedback">{errors.serviceType}</div>}
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating mb-3">
            <input type="date" className={`form-control ${errors.preferredDate ? 'is-invalid' : ''}`} id="preferredDate" name="preferredDate" value={formData.preferredDate} onChange={handleChange} />
            <label htmlFor="preferredDate">Preferred Date</label>
            {errors.preferredDate && <div className="invalid-feedback">{errors.preferredDate}</div>}
          </div>
        </div>
        <div className="col-12">
          <div className="form-floating mb-4">
            <textarea className="form-control" id="message" name="message" placeholder="Message" style={{ height: '80px' }} value={formData.message} onChange={handleChange}></textarea>
            <label htmlFor="message">Any specific issues or instructions? (Optional)</label>
          </div>
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary btn-lg rounded-pill px-5" disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Book Service'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default BookingForm;
