import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onProceedToCheckout,
}) {
  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Shopping Cart</h2>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-items">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p>Your shopping cart is currently empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item-row">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.name}</h4>
                  <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => onUpdateQty(item._id, item.qty - 1)}
                      style={{
                        background: '#f1f5f9',
                        border: 'none',
                        color: '#0f172a',
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item._id, item.qty + 1)}
                      style={{
                        background: '#f1f5f9',
                        border: 'none',
                        color: '#0f172a',
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '0.5rem',
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              className="btn-primary-black"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              onClick={onProceedToCheckout}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
