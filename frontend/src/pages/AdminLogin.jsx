import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiDroplet } from 'react-icons/fi';
import { apiService } from '../services/api';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await apiService.loginAdmin(credentials);
      if (res?.token) {
        localStorage.setItem('adminToken', res.token);
        if (res.admin) localStorage.setItem('adminUser', JSON.stringify(res.admin));
        navigate('/admin/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        (err?.response?.status === 401 ? 'Invalid username or password' : 'Login failed. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle p-3 shadow-sm mb-3">
                <FiDroplet size={32} className="text-accent" />
              </div>
              <h3 className="fw-bold">Raj Enterprises</h3>
              <p className="text-muted">Admin Portal Login</p>
            </div>

            <div className="bg-card p-4 p-md-5 rounded-4 shadow border">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label small text-muted">Username</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent text-muted"><FiUser /></span>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="username" 
                      value={credentials.username} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="form-label small text-muted">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent text-muted"><FiLock /></span>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="password" 
                      value={credentials.password} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill" disabled={isLoading}>
                  {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
