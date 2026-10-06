import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Cart({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  user,
  onLogout,
  onOpenOrders,
  onOpenAdmin,
}) {
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f4f3f0', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        cartCount={totalCount}
        onOpenCart={() => navigate('/cart')}
        user={user}
        onOpenAuth={() => navigate('/login')}
        onLogout={onLogout}
        onOpenOrders={onOpenOrders}
        onOpenAdmin={onOpenAdmin}
      />

      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '3rem 1.5rem', flex: 1 }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem' }}>
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Your shopping cart is currently empty.</p>
            <Link to="/" style={{ background: '#0f172a', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 }}>
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Product items list */}
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.25rem 1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>

                  <select
                    value={item.qty}
                    onChange={(e) => onUpdateQty(item._id, Number(e.target.value))}
                    style={{
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: 'white',
                      fontWeight: 600,
                    }}
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => onRemoveItem(item._id)}
                    style={{
                      background: 'white',
                      border: '1px solid #fecaca',
                      color: '#ef4444',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Subtotal Card below on left */}
            <div
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.75rem',
                width: '100%',
                maxWidth: '360px',
                border: '1px solid #e2e8f0',
                marginTop: '1rem',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Subtotal ({totalCount}) items
              </h3>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
                ₹{subtotal.toLocaleString('en-IN')}
              </div>
              <button
                onClick={() => navigate('/checkout')}
                style={{
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  padding: '0.85rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
