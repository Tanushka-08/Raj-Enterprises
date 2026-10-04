import React, { useState } from 'react';
import { FiSearch, FiClock, FiUser, FiCheckCircle, FiTool } from 'react-icons/fi';
import { apiService } from '../services/api';

const TicketTracker = () => {
  const [ticketId, setTicketId] = useState('');
  const [mobile, setMobile] = useState('');
  const [status, setStatus] = useState(null); // 'idle', 'loading', 'success', 'error'
  const [ticketData, setTicketData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!ticketId || !mobile) {
      setErrorMsg('Please enter both Ticket ID and Mobile Number');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setTicketData(null);

    try {
      const data = await apiService.trackService({ ticketId: ticketId.trim(), mobile: mobile.trim() });
      setTicketData(data);
      setStatus('success');
    } catch (error) {
      if (error?.response?.status === 404) {
        setErrorMsg('Ticket not found or mobile number incorrect.');
      } else {
        setErrorMsg('Could not reach the server. Please try again later.');
      }
      setStatus('error');
    }
  };

  const steps = ['Request Logged', 'Technician Assigned', 'In Progress', 'Completed'];

  const getStepIndex = (currentStatus) => steps.indexOf(currentStatus);
  const formatDate = (value) => (value ? new Date(value).toLocaleString('en-IN') : '');

  return (
    <div className="ticket-tracker">
      <form onSubmit={handleTrack} className="bg-card p-4 rounded-4 shadow-sm border mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-5">
            <label className="form-label small text-muted">Ticket ID</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. RAJ-1234" 
              value={ticketId} 
              onChange={e => setTicketId(e.target.value)} 
            />
          </div>
          <div className="col-md-5">
            <label className="form-label small text-muted">Registered Mobile</label>
            <input 
              type="tel" 
              className="form-control" 
              placeholder="10-digit mobile number" 
              value={mobile} 
              onChange={e => setMobile(e.target.value)} 
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100 h-100 py-2 d-flex align-items-center justify-content-center" disabled={status === 'loading'}>
              {status === 'loading' ? <span className="spinner-border spinner-border-sm"></span> : <><FiSearch className="me-2"/> Track</>}
            </button>
          </div>
        </div>
        {status === 'error' && <div className="text-danger small mt-2">{errorMsg}</div>}
      </form>

      {status === 'success' && ticketData && (
        <div className="bg-card p-4 rounded-4 shadow-sm border animate-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
            <div>
              <h5 className="mb-0 fw-bold">Ticket: {ticketData.ticketId}</h5>
              <small className="text-muted">
                {ticketData.serviceType}
                {(ticketData.createdAt || ticketData.preferredDate) && ` â€¢ ${formatDate(ticketData.createdAt || ticketData.preferredDate)}`}
              </small>
            </div>
            <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2">
              {ticketData.status}
            </span>
          </div>

          {/* Timeline */}
          <div className="position-relative py-4 mb-4">
            <div className="progress position-absolute top-50 start-0 w-100 translate-middle-y" style={{ height: '4px', zIndex: 0 }}>
              <div 
                className="progress-bar bg-accent" 
                role="progressbar" 
                style={{ width: `${(Math.max(0, getStepIndex(ticketData.status)) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
            <div className="d-flex justify-content-between position-relative z-1">
              {steps.map((step, idx) => {
                const isCompleted = idx <= getStepIndex(ticketData.status);
                const isActive = idx === getStepIndex(ticketData.status);
                return (
                  <div key={step} className="text-center" style={{ width: '80px' }}>
                    <div 
                      className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${isCompleted ? 'bg-accent text-on-accent' : 'bg-secondary text-white'}`}
                      style={{ width: '40px', height: '40px', border: isActive ? '4px solid rgba(0,119,182,0.3)' : 'none' }}
                    >
                      {idx === 0 && <FiClock />}
                      {idx === 1 && <FiUser />}
                      {idx === 2 && <FiTool />}
                      {idx === 3 && <FiCheckCircle />}
                    </div>
                    <small className={`fw-medium ${isActive ? 'text-accent' : 'text-muted'}`}>{step}</small>
                  </div>
                );
              })}
            </div>
          </div>

          {ticketData.technicianName && (
            <div className="bg-secondary bg-opacity-10 p-3 rounded-3 d-flex align-items-center">
              <div className="bg-white rounded-circle p-2 me-3 shadow-sm text-primary">
                <FiUser size={24} />
              </div>
              <div>
                <small className="text-muted d-block">Assigned Technician</small>
                <span className="fw-bold">{ticketData.technicianName}</span>
              </div>
            </div>
          )}

          {ticketData.status === 'Cancelled' && (
            <div className="alert alert-danger mt-4 mb-0 py-2 small">This service request has been cancelled.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketTracker;
