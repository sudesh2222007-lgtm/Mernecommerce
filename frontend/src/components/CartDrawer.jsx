import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onCheckout,
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 3000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#0d1322',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Shopping Cart</h3>
            <span className="badge badge-primary">{cartItems.length} items</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600 }}>Your cart is empty</p>
              <span style={{ fontSize: '0.85rem' }}>Add some products to get started!</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.2rem' }}>
                        {item.name}
                      </h4>
                      <span style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 700 }}>
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', padding: '2px 6px' }}>
                        <button
                          onClick={() => onUpdateQty(item._id, item.qty - 1)}
                          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item._id, item.qty + 1)}
                          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item._id)}
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex' }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--border-color)',
              background: 'rgba(15, 23, 42, 0.95)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: 800 }}>
              <span>Total</span>
              <span style={{ color: '#34d399' }}>${subtotal.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} onClick={onCheckout}>
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
