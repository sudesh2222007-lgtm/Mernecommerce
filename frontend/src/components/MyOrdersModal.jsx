import React, { useEffect, useState } from 'react';
import { X, Package } from 'lucide-react';
import { fetchMyOrdersApi } from '../services/api';

export default function MyOrdersModal({ isOpen, onClose, token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && token) {
      setLoading(true);
      fetchMyOrdersApi(token)
        .then((data) => setOrders(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px', maxHeight: '85vh', overflowY: 'auto' }}>
        <button className="btn-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>My Order History</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Track and review all your previous purchases.
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>You have not placed any orders yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER ID</span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>#{order._id}</h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: order.status === 'Delivered' ? '#dcfce7' : '#f1f5f9',
                        color: order.status === 'Delivered' ? '#15803d' : '#0f172a',
                        border: `1px solid ${order.status === 'Delivered' ? '#86efac' : '#cbd5e1'}`,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>x{item.qty}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                    Total: ₹{order.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
