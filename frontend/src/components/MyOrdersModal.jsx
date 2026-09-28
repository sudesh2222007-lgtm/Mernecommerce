import React, { useEffect, useState } from 'react';
import { X, PackageCheck, Clock, CheckCircle2, Truck } from 'lucide-react';
import { fetchMyOrders } from '../services/api';

export default function MyOrdersModal({ isOpen, onClose, showToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadOrders();
    }
  }, [isOpen]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchMyOrders();
      setOrders(data);
    } catch (err) {
      showToast(err.message || 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 4000,
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
          maxWidth: '700px',
          maxHeight: '85vh',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <PackageCheck size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>My Order History</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>Loading order history...</p>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <PackageCheck size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600 }}>No orders placed yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {orders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Order ID: #{order._id.slice(-8).toUpperCase()}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div>
                      <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
                        <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                        <span style={{ flex: 1, color: 'var(--text-main)', fontWeight: 600 }}>{item.qty}x {item.name}</span>
                        <span style={{ color: '#818cf8', fontWeight: 700 }}>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '0.6rem', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Payment: {order.paymentMethod}</span>
                    <span style={{ fontWeight: 800, color: '#34d399', fontSize: '1.05rem' }}>Total: ${order.totalPrice.toFixed(2)}</span>
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
