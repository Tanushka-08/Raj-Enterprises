import React, { useState } from 'react';
import { validateMobile, validateRequired } from '../utils/validators';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

const ContactForm = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    subject: 'General Enquiry',
    message: ''
  });

  const [lastSent, setLastSent] = useState(null);
  const [status, setStatus] = useState(null); // 'submitting', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRequired(formData.name) || !validateMobile(formData.mobile) || !validateRequired(formData.message)) {
      setErrorMsg('Please enter a valid name, 10-digit mobile number and message.');
      return;
    }

    setErrorMsg('');
    setStatus('submitting');
    const sent = { ...formData };
    try {
      await apiService.createEnquiry({
        customerName: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim() || undefined,
        productName: formData.subject,
        message: formData.message.trim(),
        source: 'contact'
      });
      setLastSent(sent);
      setStatus('success');
      setFormData({ name: '', mobile: '', email: '', subject: 'General Enquiry', message: '' });
      toast.success('Message sent successfully. We will contact you soon.', 5000);
    } catch (err) {
      setStatus(null);
      const msg =
        err?.response?.data?.errors?.[0]?.msg ||
        err?.response?.data?.message ||
        'Could not send your message. Please call 8237739994.';
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-success bg-opacity-10 text-success p-4 p-md-5 rounded-4 text-center border border-success border-opacity-25">
        <h4 className="fw-bold mb-2">Message Received!</h4>
        <p className="mb-4">
          Thank you for reaching out. Your enquiry is saved and our team will contact you on{' '}
          <strong>{lastSent?.mobile}</strong>.
        </p>
        <button className="btn btn-outline-success rounded-pill px-4" onClick={() => setStatus(null)}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card p-4 p-md-5 rounded-4 shadow-sm border">
      <h3 className="fw-bold mb-4">Send us a Message</h3>
      {errorMsg && <div className="alert alert-danger py-2 small">{errorMsg}</div>}
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small text-muted">Full Name *</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label small text-muted">Mobile Number *</label>
          <input type="tel" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label small text-muted">Email Address</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label small text-muted">Subject</label>
          <select className="form-select" name="subject" value={formData.subject} onChange={handleChange}>
            <option value="General Enquiry">General Enquiry</option>
            <option value="Product Enquiry">Product Enquiry</option>
            <option value="Service Request">Service Request</option>
            <option value="AMC Enquiry">AMC Enquiry</option>
            <option value="Complaint">Complaint</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label small text-muted">Message *</label>
          <textarea className="form-control" name="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>
        </div>
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactForm;
