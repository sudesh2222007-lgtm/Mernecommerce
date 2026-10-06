import React, { useEffect, useState } from 'react';
import { X, Plus, Trash2, PackageCheck, Layers } from 'lucide-react';
import { fetchAllOrdersApi, updateOrderStatusApi, createProductApi, deleteProductApi } from '../services/api';

export default function AdminPanel({ isOpen, onClose, token, products, onRefreshProducts, showToast }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('Norra');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');

  const loadOrders = () => {
    if (token) {
      setLoadingOrders(true);
      fetchAllOrdersApi(token)
        .then((data) => setOrders(data))
        .catch((err) => console.error(err))
        .finally(() => setLoadingOrders(false));
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus, token);
      showToast(`Order status updated to ${newStatus}`);
      loadOrders();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await createProductApi(
        { name, price: Number(price), category, brand, image, description },
        token
      );
      showToast('✨ Product created successfully!');
      setName('');
      setPrice('');
      setDescription('');
      onRefreshProducts();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductApi(id, token);
        showToast('Product deleted');
        onRefreshProducts();
      } catch (err) {
        showToast(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', maxHeight: '85vh', overflowY: 'auto' }}>
        <button className="btn-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Manage catalog inventory and update customer order fulfillment statuses.
        </p>

        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.6rem 1.2rem',
              background: activeTab === 'orders' ? '#0f172a' : 'transparent',
              color: activeTab === 'orders' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <PackageCheck size={16} /> All Customer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.6rem 1.2rem',
              background: activeTab === 'products' ? '#0f172a' : 'transparent',
              color: activeTab === 'products' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Layers size={16} /> Products Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            style={{
              padding: '0.6rem 1.2rem',
              background: activeTab === 'add' ? '#0f172a' : 'transparent',
              color: activeTab === 'add' ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>

        {activeTab === 'orders' && (
          <div>
            {loadingOrders ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No customer orders placed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((ord) => (
                  <div key={ord._id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Order #{ord._id}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer: {ord.user?.name || 'Guest'} ({ord.user?.email || 'N/A'})</p>
                        <p style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, marginTop: '4px' }}>Total Amount: ₹{ord.totalPrice.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            background: 'white',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            fontWeight: 700,
                          }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {products.map((prod) => (
              <div key={prod._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{prod.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: 600 }}>₹{prod.price.toLocaleString('en-IN')} | {prod.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteProduct(prod._id)}
                  style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#dc2626', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'add' && (
          <form onSubmit={handleCreateProduct}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Electronics">Electronics</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input type="text" className="form-input" value={brand} onChange={(e) => setBrand(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input type="text" className="form-input" value={image} onChange={(e) => setImage(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <button className="btn-primary-black">Create & Publish Product</button>
          </form>
        )}
      </div>
    </div>
  );
}
