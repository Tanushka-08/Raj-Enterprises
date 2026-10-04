import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiLogOut, FiPackage, FiMessageSquare, FiTool, FiUsers, FiShield, FiStar,
  FiGrid, FiMenu, FiX, FiDroplet, FiTrash2, FiCheckCircle, FiEdit2, FiPlus
} from 'react-icons/fi';
import { apiService } from '../services/api';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
  { id: 'products', label: 'Products', icon: FiPackage },
  { id: 'enquiries', label: 'Enquiries', icon: FiMessageSquare },
  { id: 'services', label: 'Service Requests', icon: FiTool },
  { id: 'customers', label: 'Customers', icon: FiUsers },
  { id: 'amc', label: 'AMC Plans', icon: FiShield },
  { id: 'reviews', label: 'Reviews', icon: FiStar }
];

const ENQUIRY_STATUSES = ['new', 'contacted', 'converted', 'closed'];
const SERVICE_STATUSES = ['Request Logged', 'Technician Assigned', 'In Progress', 'Completed', 'Cancelled'];
const MANAGEABLE = ['products', 'amc', 'reviews', 'customers'];

const splitList = (value) => (value || '').split(',').map((s) => s.trim()).filter(Boolean);

const emptyForm = (tab) => {
  switch (tab) {
    case 'products':
      return { name: '', brand: '', price: '', mrp: '', category: 'domestic-ro', storage: '', technology: '', shortDescription: '', description: '', warranty: '1 Year Warranty', features: '', image: '', colorName: '', colorCode: '#607d8b' };
    case 'amc':
      return { name: '', type: 'basic', price: '', duration: '1 Year', features: '', filterReplacement: false };
    case 'reviews':
      return { customerName: '', rating: 5, review: '', isApproved: false };
    case 'customers':
      return { name: '', mobile: '', email: '', address: '', pincode: '', customerType: 'residential' };
    default:
      return {};
  }
};

const rowToForm = (tab, row) => {
  switch (tab) {
    case 'products':
      return {
        name: row.name || '', brand: row.brand || '', price: row.price || '', mrp: row.mrp || '',
        category: row.category || 'domestic-ro', storage: row.storage || '', technology: row.technology || '',
        shortDescription: row.shortDescription || '', description: row.description || '',
        warranty: row.warranty || '1 Year Warranty', features: (row.features || []).join(', '),
        image: row.variants?.[0]?.image || '', colorName: row.variants?.[0]?.colorName || '',
        colorCode: row.variants?.[0]?.colorCode || '#607d8b'
      };
    case 'amc':
      return { name: row.name || '', type: row.type || 'basic', price: row.price || '', duration: row.duration || '1 Year', features: (row.features || []).join(', '), filterReplacement: !!row.filterReplacement };
    case 'reviews':
      return { customerName: row.customerName || '', rating: row.rating || 5, review: row.review || '', isApproved: !!row.isApproved };
    case 'customers':
      return { name: row.name || '', mobile: row.mobile || '', email: row.email || '', address: row.address || '', pincode: row.pincode || '', customerType: row.customerType || 'residential' };
    default:
      return {};
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [token] = useState(() => localStorage.getItem('adminToken'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const handleLogout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  }, [navigate]);

  const fetchTab = useCallback(async (tab) => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'dashboard') {
        const data = await apiService.getDashboard(token);
        setStats(data);
        setRows([]);
      } else {
        let result = [];
        if (tab === 'products') {
          const data = await apiService.getProducts({ limit: 100 });
          result = data?.products || [];
        } else if (tab === 'enquiries') {
          result = await apiService.getAllEnquiries(token);
        } else if (tab === 'services') {
          result = await apiService.getAllServices(token);
        } else if (tab === 'customers') {
          result = await apiService.getCustomers(token);
        } else if (tab === 'amc') {
          result = await apiService.getAMCPlans();
        } else if (tab === 'reviews') {
          result = await apiService.getReviews(token);
        }
        setRows(Array.isArray(result) ? result : []);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        handleLogout();
        return;
      }
      setError(err?.response?.data?.message || 'Failed to load data from the server.');
    } finally {
      setLoading(false);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchTab(activeTab);
  }, [activeTab, token, fetchTab, navigate]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    setNotice('');
    setError('');
    setShowForm(false);
    setEditingId(null);
    setFormError('');
  };

  const openCreate = () => {
    setForm(emptyForm(activeTab));
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (row) => {
    setForm(rowToForm(activeTab, row));
    setEditingId(row._id);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({});
    setFormError('');
  };

  const handleField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const buildPayload = () => {
    if (activeTab === 'products') {
      const p = { name: form.name.trim(), brand: form.brand.trim(), price: Number(form.price) };
      if (form.mrp) p.mrp = Number(form.mrp);
      if (form.category) p.category = form.category;
      if (form.storage) p.storage = form.storage;
      if (form.technology) p.technology = form.technology;
      if (form.shortDescription) p.shortDescription = form.shortDescription;
      if (form.description) p.description = form.description;
      if (form.warranty) p.warranty = form.warranty;
      if (form.features) p.features = splitList(form.features);
      if (form.image) p.variants = [{ colorName: form.colorName || 'Standard', colorCode: form.colorCode || '#607d8b', image: form.image }];
      return p;
    }
    if (activeTab === 'amc') {
      return {
        name: form.name.trim(), type: form.type, price: Number(form.price),
        duration: form.duration || '1 Year', features: splitList(form.features),
        filterReplacement: !!form.filterReplacement
      };
    }
    if (activeTab === 'reviews') {
      return { customerName: form.customerName.trim(), rating: Number(form.rating), review: form.review.trim(), isApproved: !!form.isApproved };
    }
    if (activeTab === 'customers') {
      const c = { name: form.name.trim(), mobile: form.mobile.trim(), customerType: form.customerType };
      if (form.email) c.email = form.email;
      if (form.address) c.address = form.address;
      if (form.pincode) c.pincode = form.pincode;
      return c;
    }
    return {};
  };

  const validateForm = () => {
    if (activeTab === 'products' && (!form.name?.trim() || !form.brand?.trim() || !form.price)) return 'Name, brand and price are required.';
    if (activeTab === 'amc' && (!form.name?.trim() || !form.price)) return 'Plan name and price are required.';
    if (activeTab === 'reviews' && (!form.customerName?.trim() || !form.review?.trim())) return 'Customer name and review text are required.';
    if (activeTab === 'customers' && (!form.name?.trim() || !form.mobile?.trim())) return 'Name and mobile are required.';
    return '';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateForm();
    if (invalid) { setFormError(invalid); return; }

    setFormError('');
    setSaving(true);
    try {
      const payload = buildPayload();
      if (activeTab === 'products') {
        if (editingId) await apiService.updateProduct(editingId, payload, token);
        else await apiService.createProduct(payload, token);
      } else if (activeTab === 'amc') {
        if (editingId) await apiService.updateAMCPlan(editingId, payload, token);
        else await apiService.createAMCPlan(payload, token);
      } else if (activeTab === 'reviews') {
        if (editingId) await apiService.updateReview(editingId, payload, token);
        else await apiService.createReview(payload, token);
      } else if (activeTab === 'customers') {
        if (editingId) await apiService.updateCustomer(editingId, payload, token);
        else await apiService.createCustomer(payload, token);
      }
      setNotice(editingId ? 'Record updated.' : 'Record created.');
      closeForm();
      fetchTab(activeTab);
    } catch (err) {
      setFormError(err?.response?.data?.errors?.[0]?.msg || err?.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record? This cannot be undone.')) return;
    try {
      if (activeTab === 'products') await apiService.deleteProduct(id, token);
      else if (activeTab === 'enquiries') await apiService.deleteEnquiry(id, token);
      else if (activeTab === 'services') await apiService.deleteService(id, token);
      else if (activeTab === 'customers') await apiService.deleteCustomer(id, token);
      else if (activeTab === 'amc') await apiService.deleteAMCPlan(id, token);
      else if (activeTab === 'reviews') await apiService.deleteReview(id, token);
      setNotice('Record deleted.');
      fetchTab(activeTab);
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed.');
    }
  };

  const updateRecord = async (id, payload) => {
    try {
      if (activeTab === 'enquiries') await apiService.updateEnquiry(id, payload, token);
      else if (activeTab === 'services') await apiService.updateService(id, payload, token);
      else if (activeTab === 'reviews') await apiService.updateReview(id, payload, token);
      setNotice('Updated successfully.');
      fetchTab(activeTab);
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed.');
    }
  };

  const renderFormFields = () => {
    if (activeTab === 'products') {
      return (
        <div className="row g-3">
          <div className="col-md-6"><label className="form-label small text-muted">Name *</label><input className="form-control" value={form.name} onChange={(e) => handleField('name', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label small text-muted">Brand *</label><input className="form-control" value={form.brand} onChange={(e) => handleField('brand', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label small text-muted">Price *</label><input type="number" className="form-control" value={form.price} onChange={(e) => handleField('price', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label small text-muted">MRP</label><input type="number" className="form-control" value={form.mrp} onChange={(e) => handleField('mrp', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label small text-muted">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => handleField('category', e.target.value)}>
              <option value="domestic-ro">domestic-ro</option>
              <option value="uv-purifier">uv-purifier</option>
            </select>
          </div>
          <div className="col-md-3"><label className="form-label small text-muted">Storage</label><input className="form-control" value={form.storage} onChange={(e) => handleField('storage', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label small text-muted">Technology</label><input className="form-control" value={form.technology} onChange={(e) => handleField('technology', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label small text-muted">Warranty</label><input className="form-control" value={form.warranty} onChange={(e) => handleField('warranty', e.target.value)} /></div>
          <div className="col-12"><label className="form-label small text-muted">Short Description</label><input className="form-control" value={form.shortDescription} onChange={(e) => handleField('shortDescription', e.target.value)} /></div>
          <div className="col-12"><label className="form-label small text-muted">Full Description</label><textarea className="form-control" rows="2" value={form.description} onChange={(e) => handleField('description', e.target.value)}></textarea></div>
          <div className="col-12"><label className="form-label small text-muted">Features (comma separated)</label><input className="form-control" value={form.features} onChange={(e) => handleField('features', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label small text-muted">Primary Image URL</label><input className="form-control" placeholder="/images/products/..." value={form.image} onChange={(e) => handleField('image', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label small text-muted">Colour Name</label><input className="form-control" value={form.colorName} onChange={(e) => handleField('colorName', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label small text-muted">Colour Hex</label><input type="color" className="form-control form-control-color" value={form.colorCode} onChange={(e) => handleField('colorCode', e.target.value)} /></div>
        </div>
      );
    }
    if (activeTab === 'amc') {
      return (
        <div className="row g-3">
          <div className="col-md-6"><label className="form-label small text-muted">Plan Name *</label><input className="form-control" value={form.name} onChange={(e) => handleField('name', e.target.value)} /></div>
          <div className="col-md-3"><label className="form-label small text-muted">Type</label>
            <select className="form-select" value={form.type} onChange={(e) => handleField('type', e.target.value)}>
              <option value="basic">basic</option>
              <option value="premium">premium</option>
            </select>
          </div>
          <div className="col-md-3"><label className="form-label small text-muted">Price *</label><input type="number" className="form-control" value={form.price} onChange={(e) => handleField('price', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label small text-muted">Duration</label><input className="form-control" value={form.duration} onChange={(e) => handleField('duration', e.target.value)} /></div>
          <div className="col-md-6 d-flex align-items-end">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="filterReplacement" checked={form.filterReplacement} onChange={(e) => handleField('filterReplacement', e.target.checked)} />
              <label className="form-check-label small text-muted" htmlFor="filterReplacement">Includes filter replacement</label>
            </div>
          </div>
          <div className="col-12"><label className="form-label small text-muted">Features (comma separated)</label><input className="form-control" value={form.features} onChange={(e) => handleField('features', e.target.value)} /></div>
        </div>
      );
    }
    if (activeTab === 'reviews') {
      return (
        <div className="row g-3">
          <div className="col-md-8"><label className="form-label small text-muted">Customer Name *</label><input className="form-control" value={form.customerName} onChange={(e) => handleField('customerName', e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label small text-muted">Rating</label>
            <select className="form-select" value={form.rating} onChange={(e) => handleField('rating', e.target.value)}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-12"><label className="form-label small text-muted">Review *</label><textarea className="form-control" rows="3" value={form.review} onChange={(e) => handleField('review', e.target.value)}></textarea></div>
          <div className="col-12">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="isApproved" checked={form.isApproved} onChange={(e) => handleField('isApproved', e.target.checked)} />
              <label className="form-check-label small text-muted" htmlFor="isApproved">Approved (visible on site)</label>
            </div>
          </div>
        </div>
      );
    }
    if (activeTab === 'customers') {
      return (
        <div className="row g-3">
          <div className="col-md-6"><label className="form-label small text-muted">Name *</label><input className="form-control" value={form.name} onChange={(e) => handleField('name', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label small text-muted">Mobile *</label><input className="form-control" value={form.mobile} onChange={(e) => handleField('mobile', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label small text-muted">Email</label><input className="form-control" value={form.email} onChange={(e) => handleField('email', e.target.value)} /></div>
          <div className="col-md-6"><label className="form-label small text-muted">Type</label>
            <select className="form-select" value={form.customerType} onChange={(e) => handleField('customerType', e.target.value)}>
              <option value="residential">residential</option>
              <option value="commercial">commercial</option>
              <option value="office">office</option>
            </select>
          </div>
          <div className="col-md-8"><label className="form-label small text-muted">Address</label><input className="form-control" value={form.address} onChange={(e) => handleField('address', e.target.value)} /></div>
          <div className="col-md-4"><label className="form-label small text-muted">Pincode</label><input className="form-control" value={form.pincode} onChange={(e) => handleField('pincode', e.target.value)} /></div>
        </div>
      );
    }
    return null;
  };

  if (!token) return null;

  const tabLabel = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

  return (
    <div className="d-flex min-vh-100 bg-secondary bg-opacity-10">
      {sidebarOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none" style={{ zIndex: 1035 }} onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className={`admin-sidebar bg-card border-end ${sidebarOpen ? 'open' : ''}`}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
          <Link to="/" className="text-decoration-none d-flex align-items-center text-body">
            <FiDroplet className="text-accent me-2" size={24} />
            <h5 className="mb-0 fw-bold">Admin Panel</h5>
          </Link>
          <button className="btn btn-sm btn-light d-lg-none" onClick={() => setSidebarOpen(false)}><FiX /></button>
        </div>
        <div className="p-3">
          <ul className="list-unstyled mb-0">
            {navItems.map((item) => (
              <li key={item.id} className="mb-1">
                <button
                  className={`w-100 text-start border-0 sidebar-link d-flex align-items-center ${activeTab === item.id ? 'active fw-bold' : ''}`}
                  onClick={() => switchTab(item.id)}
                >
                  <item.icon className="me-3" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="position-absolute bottom-0 w-100 p-3 border-top">
          <button onClick={handleLogout} className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center">
            <FiLogOut className="me-2" /> Logout
          </button>
        </div>
      </div>

      <div className="admin-main flex-grow-1">
        <header className="bg-card border-bottom p-3 d-flex align-items-center justify-content-between sticky-top" style={{ zIndex: 1020 }}>
          <div className="d-flex align-items-center">
            <button className="btn btn-light d-lg-none me-3" onClick={() => setSidebarOpen(true)}>
              <FiMenu size={20} />
            </button>
            <h4 className="mb-0 fw-bold text-capitalize">{activeTab.replace('-', ' ')}</h4>
          </div>
          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
            A
          </div>
        </header>

        <main className="p-4">
          {error && <div className="alert alert-danger d-flex justify-content-between align-items-center">{error}<button className="btn btn-sm btn-link text-danger" onClick={() => setError('')}><FiX /></button></div>}
          {notice && <div className="alert alert-success d-flex justify-content-between align-items-center">{notice}<button className="btn btn-sm btn-link text-success" onClick={() => setNotice('')}><FiX /></button></div>}

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : activeTab === 'dashboard' ? (
            <div className="row g-4">
              {[
                { title: 'Total Products', value: stats?.totalProducts, color: 'primary' },
                { title: 'Total Enquiries', value: stats?.totalEnquiries, color: 'info' },
                { title: 'Total Service Requests', value: stats?.totalServiceRequests, color: 'secondary' },
                { title: 'Pending Requests', value: stats?.pendingRequests, color: 'warning' },
                { title: 'Active Services', value: stats?.activeRequests, color: 'dark' },
                { title: 'Completed Services', value: stats?.completedRequests, color: 'success' },
                { title: 'Total Customers', value: stats?.totalCustomers, color: 'primary' }
              ].map((stat) => (
                <div key={stat.title} className="col-md-6 col-lg-3">
                  <div className={`bg-card p-4 rounded-4 border border-${stat.color} shadow-sm border-opacity-25 h-100`}>
                    <h6 className="text-muted mb-2">{stat.title}</h6>
                    <h2 className="fw-bold mb-0">{stat?.value ?? 0}</h2>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card p-3 p-md-4 rounded-4 border shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">{tabLabel}</h5>
                {MANAGEABLE.includes(activeTab) && !showForm && (
                  <button className="btn btn-primary btn-sm rounded-pill px-3" onClick={openCreate}>
                    <FiPlus className="me-1" /> Add {tabLabel.replace(/s$/, '')}
                  </button>
                )}
              </div>

              {showForm && MANAGEABLE.includes(activeTab) && (
                <form onSubmit={handleFormSubmit} className="border rounded-4 p-3 p-md-4 mb-4 bg-secondary bg-opacity-10">
                  <h6 className="fw-bold mb-3">{editingId ? `Edit ${tabLabel.replace(/s$/, '')}` : `New ${tabLabel.replace(/s$/, '')}`}</h6>
                  {formError && <div className="alert alert-danger py-2 small">{formError}</div>}
                  {renderFormFields()}
                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary rounded-pill px-4" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                    <button type="button" className="btn btn-outline-secondary rounded-pill px-4" onClick={closeForm}>Cancel</button>
                  </div>
                </form>
              )}

              {rows.length === 0 ? (
                <p className="text-center text-muted py-4 mb-0">No records found.</p>
              ) : (
                <div className="table-responsive">
                  {activeTab === 'products' && (
                    <table className="table table-hover align-middle">
                      <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Storage</th><th></th></tr></thead>
                      <tbody>
                        {rows.map((p) => (
                          <tr key={p._id}>
                            <td className="fw-medium">{p.name}</td>
                            <td className="text-muted small">{p.category}</td>
                            <td>₹{p.price}</td>
                            <td className="text-muted small">{p.storage || '-'}</td>
                            <td className="text-end text-nowrap">
                              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(p)}><FiEdit2 /></button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'enquiries' && (
                    <table className="table table-hover align-middle">
                      <thead><tr><th>Customer</th><th>Mobile</th><th>Product</th><th>Status</th><th></th></tr></thead>
                      <tbody>
                        {rows.map((e) => (
                          <tr key={e._id}>
                            <td className="fw-medium">{e.customerName}</td>
                            <td>{e.mobile}</td>
                            <td className="text-muted small">{e.productName || '-'}</td>
                            <td>
                              <select className="form-select form-select-sm" value={e.status} onChange={(ev) => updateRecord(e._id, { status: ev.target.value })}>
                                {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(e._id)}><FiTrash2 /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'services' && (
                    <table className="table table-hover align-middle">
                      <thead><tr><th>Ticket</th><th>Customer</th><th>Service</th><th>Status</th><th>Technician</th><th></th></tr></thead>
                      <tbody>
                        {rows.map((s) => (
                          <tr key={s._id}>
                            <td className="fw-medium">{s.ticketId}</td>
                            <td>{s.customerName}<div className="small text-muted">{s.mobile}</div></td>
                            <td className="text-muted small">{s.serviceType}</td>
                            <td>
                              <select className="form-select form-select-sm" value={s.status} onChange={(ev) => updateRecord(s._id, { status: ev.target.value })}>
                                {SERVICE_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                              </select>
                            </td>
                            <td style={{ minWidth: '140px' }}>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                defaultValue={s.technicianName || ''}
                                placeholder="Assign"
                                onBlur={(ev) => {
                                  if (ev.target.value !== (s.technicianName || '')) updateRecord(s._id, { technicianName: ev.target.value });
                                }}
                              />
                            </td>
                            <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s._id)}><FiTrash2 /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'customers' && (
                    <table className="table table-hover align-middle">
                      <thead><tr><th>Name</th><th>Mobile</th><th>Email</th><th>Type</th><th></th></tr></thead>
                      <tbody>
                        {rows.map((c) => (
                          <tr key={c._id}>
                            <td className="fw-medium">{c.name}</td>
                            <td>{c.mobile}</td>
                            <td className="text-muted small">{c.email || '-'}</td>
                            <td className="text-muted small">{c.customerType || '-'}</td>
                            <td className="text-end text-nowrap">
                              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(c)}><FiEdit2 /></button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}><FiTrash2 /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'amc' && (
                    <table className="table table-hover align-middle">
                      <thead><tr><th>Plan</th><th>Type</th><th>Price</th><th>Duration</th><th></th></tr></thead>
                      <tbody>
                        {rows.map((a) => (
                          <tr key={a._id}>
                            <td className="fw-medium">{a.name}</td>
                            <td className="text-muted small text-capitalize">{a.type}</td>
                            <td>₹{a.price}</td>
                            <td className="text-muted small">{a.duration}</td>
                            <td className="text-end text-nowrap">
                              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(a)}><FiEdit2 /></button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a._id)}><FiTrash2 /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {activeTab === 'reviews' && (
                    <table className="table table-hover align-middle">
                      <thead><tr><th>Customer</th><th>Rating</th><th>Review</th><th>Approved</th><th></th></tr></thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r._id}>
                            <td className="fw-medium">{r.customerName}</td>
                            <td>{r.rating} / 5</td>
                            <td className="text-muted small" style={{ maxWidth: '320px' }}>{r.review}</td>
                            <td>
                              <button
                                className={`btn btn-sm ${r.isApproved ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={() => updateRecord(r._id, { isApproved: !r.isApproved })}
                              >
                                {r.isApproved ? <FiCheckCircle /> : 'Pending'}
                              </button>
                            </td>
                            <td className="text-end text-nowrap">
                              <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(r)}><FiEdit2 /></button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(r._id)}><FiTrash2 /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
