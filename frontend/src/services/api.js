import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const apiService = {
  // Products
  getProducts: async (params) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  createProduct: async (data, token) => {
    const res = await api.post('/products', data, getAuthHeaders(token));
    return res.data;
  },
  updateProduct: async (id, data, token) => {
    const res = await api.put(`/products/${id}`, data, getAuthHeaders(token));
    return res.data;
  },
  deleteProduct: async (id, token) => {
    const res = await api.delete(`/products/${id}`, getAuthHeaders(token));
    return res.data;
  },

  // Services
  createServiceRequest: async (data) => {
    const res = await api.post('/services', data);
    return res.data;
  },
  trackService: async (data) => {
    const res = await api.post('/services/track', data);
    return res.data;
  },
  getAllServices: async (token) => {
    const res = await api.get('/services', getAuthHeaders(token));
    return res.data;
  },
  updateService: async (id, data, token) => {
    const res = await api.put(`/services/${id}`, data, getAuthHeaders(token));
    return res.data;
  },
  deleteService: async (id, token) => {
    const res = await api.delete(`/services/${id}`, getAuthHeaders(token));
    return res.data;
  },

  // Enquiries
  createEnquiry: async (data) => {
    const res = await api.post('/enquiries', data);
    return res.data;
  },
  getAllEnquiries: async (token) => {
    const res = await api.get('/enquiries', getAuthHeaders(token));
    return res.data;
  },
  updateEnquiry: async (id, data, token) => {
    const res = await api.put(`/enquiries/${id}`, data, getAuthHeaders(token));
    return res.data;
  },
  deleteEnquiry: async (id, token) => {
    const res = await api.delete(`/enquiries/${id}`, getAuthHeaders(token));
    return res.data;
  },

  // AMC
  getAMCPlans: async () => {
    const res = await api.get('/amc');
    return res.data;
  },
  getAMCPlanById: async (id) => {
    const res = await api.get(`/amc/${id}`);
    return res.data;
  },
  createAMCPlan: async (data, token) => {
    const res = await api.post('/amc', data, getAuthHeaders(token));
    return res.data;
  },
  updateAMCPlan: async (id, data, token) => {
    const res = await api.put(`/amc/${id}`, data, getAuthHeaders(token));
    return res.data;
  },
  deleteAMCPlan: async (id, token) => {
    const res = await api.delete(`/amc/${id}`, getAuthHeaders(token));
    return res.data;
  },

  // Admin
  loginAdmin: async (credentials) => {
    const res = await api.post('/admin/login', credentials);
    return res.data;
  },
  getDashboard: async (token) => {
    const res = await api.get('/admin/dashboard', getAuthHeaders(token));
    return res.data;
  },
  registerAdmin: async (data, token) => {
    const res = await api.post('/admin/register', data, getAuthHeaders(token));
    return res.data;
  },

  // Reviews
  getReviews: async (token) => {
    const res = await api.get('/reviews', token ? getAuthHeaders(token) : undefined);
    return res.data;
  },
  createPublicReview: async (data) => {
    const res = await api.post('/reviews/public', data);
    return res.data;
  },
  createReview: async (data, token) => {
    const res = await api.post('/reviews', data, getAuthHeaders(token));
    return res.data;
  },
  updateReview: async (id, data, token) => {
    const res = await api.put(`/reviews/${id}`, data, getAuthHeaders(token));
    return res.data;
  },
  deleteReview: async (id, token) => {
    const res = await api.delete(`/reviews/${id}`, getAuthHeaders(token));
    return res.data;
  },

  // Customers
  getCustomers: async (token) => {
    const res = await api.get('/customers', getAuthHeaders(token));
    return res.data;
  },
  createCustomer: async (data, token) => {
    const res = await api.post('/customers', data, getAuthHeaders(token));
    return res.data;
  },
  updateCustomer: async (id, data, token) => {
    const res = await api.put(`/customers/${id}`, data, getAuthHeaders(token));
    return res.data;
  },
  deleteCustomer: async (id, token) => {
    const res = await api.delete(`/customers/${id}`, getAuthHeaders(token));
    return res.data;
  }
};
