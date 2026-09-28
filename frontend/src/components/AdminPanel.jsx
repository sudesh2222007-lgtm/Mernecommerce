import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ShieldCheck, Package, ShoppingBag, RefreshCw } from 'lucide-react';
import { createProductApi, deleteProductApi, fetchAllOrdersAdmin, updateOrderStatusApi } from '../services/api';

export default function AdminPanel({ isOpen, onClose, products, onRefreshProducts, showToast }) {
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);

  // New product form state
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('Aura');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState('10');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'orders') {
      loadAdminOrders();
    }
  }, [isOpen, activeTab]);

  const loadAdminOrders = async () => {
    try {
      const data = await fetchAllOrdersAdmin();
      setOrders(data);
    } catch (err) {
      showToast(err.message || 'Failed to load admin orders', 'error');
    }
  };

  if (!isOpen) return null;

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProductApi({
        name,
        price: Number(price),
        category,
        brand,
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        description,
        countInStock: Number(countInStock),
      });
      showToast('New product added to inventory!', 'success');
      onRefreshProducts();
      setName('');
      setPrice('');
      setImage('');
      setDescription('');
    } catch (err) {
      showToast(err.message || 'Failed to create product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductApi(id);
        showToast('Product removed successfully', 'success');
        onRefreshProducts();
      } catch (err) {
        showToast(err.message || 'Failed to delete product', 'error');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusApi(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadAdminOrders();
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 5000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '900px',
          height: '85vh',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0f172a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={24} color="#818cf8" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Admin Management Portal</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '1rem 1.5rem',
              background: activeTab === 'products' ? 'rgba(99, 102, 241, 0.15)' : 'none',
              border: 'none',
              borderBottom: activeTab === 'products' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'products' ? 'white' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Package size={18} />
            <span>Manage Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            style={{
              padding: '1rem 1.5rem',
              background: activeTab === 'add' ? 'rgba(99, 102, 241, 0.15)' : 'none',
              border: 'none',
              borderBottom: activeTab === 'add' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'add' ? 'white' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '1rem 1.5rem',
              background: activeTab === 'orders' ? 'rgba(99, 102, 241, 0.15)' : 'none',
              border: 'none',
              borderBottom: activeTab === 'orders' ? '2px solid var(--primary)' : 'none',
              color: activeTab === 'orders' ? 'white' : 'var(--text-muted)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <ShoppingBag size={18} />
            <span>Manage Orders</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {activeTab === 'products' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
              {products.map((p) => (
                <div key={p._id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h5>
                    <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700 }}>${p.price}</span>
                  </div>
                  <button onClick={() => handleDeleteProduct(p._id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleCreateProduct} style={{ maxWidth: '540px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Product Title</label>
                <input type="text" required placeholder="e.g. Aura Studio Noise Cancelling Headset" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Price ($)</label>
                  <input type="number" step="0.01" required placeholder="199.99" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: '#1e293b', border: '1px solid var(--border-color)', color: 'white' }}>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Image URL</label>
                <input type="url" placeholder="https://images.unsplash.com/..." value={image} onChange={(e) => setImage(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Description</label>
                <textarea rows="3" required placeholder="Product specifications and features..." value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white' }} />
              </div>

              <button className="btn btn-primary" type="submit" disabled={loading} style={{ padding: '0.85rem' }}>
                <Plus size={18} />
                <span>{loading ? 'Creating...' : 'Publish Product'}</span>
              </button>
            </form>
          )}

          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((ord) => (
                <div key={ord._id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Order #{ord._id.slice(-8)}</h5>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customer: {ord.user?.name || 'User'} ({ord.user?.email})</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginTop: '0.2rem' }}>Total: ${ord.totalPrice.toFixed(2)}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <select
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', background: '#1e293b', border: '1px solid var(--border-color)', color: 'white', fontSize: '0.85rem' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
