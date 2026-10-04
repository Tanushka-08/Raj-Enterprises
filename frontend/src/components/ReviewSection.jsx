import React, { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { apiService } from '../services/api';

const ReviewSection = ({ reviews: reviewsProp }) => {
  const [ref, isVisible] = useScrollReveal();
  const [reviews, setReviews] = useState(reviewsProp || []);
  const [loading, setLoading] = useState(!reviewsProp);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: '', rating: 5, review: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (reviewsProp) return;
    let cancelled = false;
    const loadReviews = async () => {
      try {
        const data = await apiService.getReviews();
        if (!cancelled) setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadReviews();
    return () => { cancelled = true; };
  }, [reviewsProp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.review.trim()) {
      setMessage('Please enter your name and review.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      await apiService.createPublicReview({
        customerName: form.customerName.trim(),
        rating: Number(form.rating),
        review: form.review.trim()
      });
      setMessage('Thank you! Your review will appear once approved.');
      setForm({ customerName: '', rating: 5, review: '' });
      setShowForm(false);
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Could not submit your review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={ref} className={`py-5 ${isVisible ? 'animate-fade-up' : 'reveal-hidden'}`}>
      <div className="text-center mb-5">
        <h2 className="fw-bold heading-underline is-in">What Our Customers Say</h2>
        <p className="text-secondary">Trusted by families in Navi Mumbai</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-5 bg-card rounded-4 border shadow-sm">
          <div className="text-warning mb-3">
            {[...Array(5)].map((_, i) => <FiStar key={i} size={32} className="mx-1" />)}
          </div>
          <h4 className="fw-bold text-muted">Customer Reviews Coming Soon</h4>
          <p className="text-secondary">Be the first to share your experience with Raj Enterprises.</p>
        </div>
      ) : (
        <div className="row g-4">
          {reviews.map((review, idx) => (
            <div key={review._id || idx} className="col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 bg-card p-4">
                <div className="text-warning mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} style={{ fill: i < review.rating ? 'currentColor' : 'none' }} />
                  ))}
                </div>
                <p className="fst-italic text-secondary mb-4">"{review.review}"</p>
                <div className="mt-auto d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                    {review.customerName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">{review.customerName}</h6>
                    <small className="text-muted">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN') : ''}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        {message && <div className="alert alert-info py-2 small d-inline-block">{message}</div>}
        {!showForm && (
          <div>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={() => { setShowForm(true); setMessage(''); }}>
              Write a Review
            </button>
          </div>
        )}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card border rounded-4 shadow-sm p-4 text-start mx-auto mt-3" style={{ maxWidth: '520px' }}>
            <h5 className="fw-bold mb-3">Share Your Experience</h5>
            <div className="mb-3">
              <label className="form-label small text-muted">Your Name *</label>
              <input
                type="text"
                className="form-control"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">Rating</label>
              <select
                className="form-select"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              >
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label small text-muted">Review *</label>
              <textarea
                className="form-control"
                rows="3"
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
