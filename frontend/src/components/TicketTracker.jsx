import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiUser, FiCheckCircle, FiTool, FiXCircle, FiInbox } from 'react-icons/fi';
import { apiService } from '../services/api';

// The lifecycle order is mirrored from the backend (backend/utils/ticketStatus.js)
// so the animation always follows the real status stored in MongoDB.
const STEPS = [
  { key: 'Request Logged', label: 'Request Logged', Icon: FiClock },
  { key: 'Technician Assigned', label: 'Technician Assigned', Icon: FiUser },
  { key: 'In Progress', label: 'In Progress', Icon: FiTool },
  { key: 'Completed', label: 'Completed', Icon: FiCheckCircle }
];

const STATUS_TONE = {
  'Request Logged': 'status-pending',
  'Technician Assigned': 'status-active',
  'In Progress': 'status-progress',
  'Completed': 'status-done',
  'Cancelled': 'status-cancelled'
};

const formatDateTime = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const TicketTracker = () => {
  const [ticketId, setTicketId] = useState('');
  const [mobile, setMobile] = useState('');
  const [status, setStatus] = useState(null); // 'loading' | 'success' | 'error'
  const [ticketData, setTicketData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // The fill animates from 0 whenever a new ticket is loaded, so the progress
  // bar visibly travels to the real status instead of snapping into place.
  const [progress, setProgress] = useState(0);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!ticketId.trim() || !mobile.trim()) {
      setErrorMsg('Please enter both Ticket ID and Mobile Number');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setTicketData(null);
    setProgress(0);

    try {
      const data = await apiService.trackService({ ticketId: ticketId.trim(), mobile: mobile.trim() });
      setTicketData(data);
      setStatus('success');
    } catch (error) {
      if (error?.response?.status === 404) {
        setErrorMsg('Ticket not found or mobile number incorrect. Please check both and try again.');
      } else if (error?.response?.status === 429) {
        setErrorMsg('Too many attempts. Please wait a few minutes and try again.');
      } else {
        setErrorMsg('Could not reach the server. Please try again in a moment.');
      }
      setStatus('error');
    }
  };

  // Build a status -> timestamp map out of the real statusHistory array
  const historyMap = {};
  if (ticketData?.statusHistory?.length) {
    ticketData.statusHistory.forEach((entry) => {
      if (!historyMap[entry.status]) historyMap[entry.status] = entry.at;
    });
  }

  const currentIndex = ticketData ? STEPS.findIndex((s) => s.key === ticketData.status) : -1;
  const isCancelled = ticketData?.status === 'Cancelled';
  const targetPercent = currentIndex >= 0 ? (currentIndex / (STEPS.length - 1)) * 100 : 0;

  useEffect(() => {
    if (status !== 'success') return undefined;
    // Small delay so the bar animates after the card mounts
    const t = setTimeout(() => setProgress(targetPercent), 120);
    return () => clearTimeout(t);
  }, [status, targetPercent]);

  // Fallback for tickets created before the history field existed
  const history = ticketData?.statusHistory?.length
    ? ticketData.statusHistory
    : ticketData
      ? [{ status: ticketData.status, at: ticketData.updatedAt || ticketData.createdAt }]
      : [];

  return (
    <div className="ticket-tracker">
      <form onSubmit={handleTrack} className="premium-panel p-4 mb-4" noValidate>
        <div className="row g-3 align-items-end">
          <div className="col-md-5">
            <label className="form-label small text-muted" htmlFor="track-ticket">Ticket ID</label>
            <input
              id="track-ticket"
              type="text"
              className="form-control"
              placeholder="e.g. RAJ-20261005-1234"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              autoCapitalize="characters"
            />
          </div>
          <div className="col-md-5">
            <label className="form-label small text-muted" htmlFor="track-mobile">Registered Mobile</label>
            <input
              id="track-mobile"
              type="tel"
              inputMode="numeric"
              maxLength={14}
              className="form-control"
              placeholder="10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center" disabled={status === 'loading'}>
              {status === 'loading' ? <span className="spinner-border spinner-border-sm" /> : <><FiSearch className="me-2" /> Track</>}
            </button>
          </div>
        </div>
        {status === 'error' && <div className="text-danger small mt-2" role="alert">{errorMsg}</div>}
      </form>

      {status === 'success' && ticketData && (
        <motion.div
          className="tracker-shell"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="tracker-header">
            <div>
              <p className="text-muted small mb-1 text-uppercase" style={{ letterSpacing: '0.12em' }}>Ticket</p>
              <h5 className="tracker-ticket-id mb-0">{ticketData.ticketId}</h5>
              <small className="text-muted">
                {ticketData.serviceType}
                {ticketData.createdAt ? ` • raised ${formatDateTime(ticketData.createdAt)}` : ''}
              </small>
            </div>
            <span className={`status-pill ${STATUS_TONE[ticketData.status] || 'status-pending'}`}>
              {ticketData.status}
            </span>
          </div>

          {isCancelled ? (
            <div className="p-4">
              <div className="d-flex align-items-start gap-3 p-3 rounded-3 status-cancelled">
                <FiXCircle size={26} className="flex-shrink-0" />
                <div>
                  <strong className="d-block">This request was cancelled</strong>
                  <span className="small">
                    {historyMap.Cancelled ? `Cancelled on ${formatDateTime(historyMap.Cancelled)}.` : 'This service request is no longer active.'}{' '}
                    Need it re-opened? Call {ticketData.mobile ? `us on ${ticketData.mobile}` : 'us'}.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="tracker-flow">
              <div className="tracker-line" aria-hidden="true">
                <motion.div
                  className="tracker-line-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              <div className="tracker-steps">
                {STEPS.map((step, idx) => {
                  const done = idx <= currentIndex;
                  const current = idx === currentIndex;
                  const at = historyMap[step.key];
                  return (
                    <div key={step.key} className={`tracker-step ${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`}>
                      <span className="tracker-dot-wrap">
                        <span className="tracker-dot">
                          <step.Icon />
                        </span>
                      </span>
                      <span className="tracker-step-label d-block">{step.label}</span>
                      {at && <span className="tracker-step-time">{formatDateTime(at)}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* real data from the document */}
          <div className="tracker-meta">
            <div className="tracker-meta-item">
              <small>Service</small>
              <strong>{ticketData.serviceType}</strong>
            </div>
            <div className="tracker-meta-item">
              <small>Preferred date</small>
              <strong>{ticketData.preferredDate ? formatDateTime(ticketData.preferredDate) : '—'}</strong>
            </div>
            <div className="tracker-meta-item">
              <small>Property</small>
              <strong style={{ textTransform: 'capitalize' }}>{ticketData.customerType || 'residential'}</strong>
            </div>
            <div className="tracker-meta-item">
              <small>Technician</small>
              <strong>{ticketData.technicianName || 'To be assigned'}</strong>
            </div>
          </div>

          {history.length > 0 && (
            <div className="tracker-history">
              <h6>Status history</h6>
              {[...history].reverse().map((entry, idx) => (
                <div className="tracker-history-item" key={`${entry.status}-${idx}`}>
                  <strong>{entry.status}</strong>
                  {entry.at && <span className="text-muted"> • {formatDateTime(entry.at)}</span>}
                  {entry.note && <span className="d-block text-muted small">{entry.note}</span>}
                </div>
              ))}
            </div>
          )}

          {!ticketData.technicianName && !isCancelled && (
            <div className="px-4 pb-4">
              <div className="d-flex align-items-center gap-2 p-3 rounded-3 bg-secondary bg-opacity-10 small text-secondary">
                <FiInbox size={18} className="text-accent flex-shrink-0" />
                Technician assignment usually happens within a few hours. You can re-check this page any time.
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TicketTracker;
