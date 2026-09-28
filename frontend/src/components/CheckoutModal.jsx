import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle, Truck } from 'lucide-react';
import { createOrderApi } from '../services/api';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  user,
  onOrderSuccess,
  showToast,
}) {
  const [address, setAddress] = useState('123 Tech Avenue');
  const [city, setCity] = useState('Silicon Valley');
  const [postalCode, setPostalCode] = useState('94025');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card / UPI');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 15;
  const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to complete checkout', 'error');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const createdOrder = await createOrderApi(orderPayload);
      showToast('Order placed successfully!', 'success');
      onOrderSuccess(createdOrder);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
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
          maxWidth: '750px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 10 }}
        >
          <X size={20} />
        </button>

        {/* Shipping Form Left */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Truck size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Shipping & Payment</h3>
            </div>

            <form id="checkout-form" onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Postal Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-sm)', background: '#1e293b', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
                >
                  <option value="Credit Card / UPI">Credit Card / Debit / UPI</option>
                  <option value="PayPal">PayPal Instant</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
                </select>
              </div>
            </form>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <ShieldCheck size={16} color="#34d399" />
            <span>Encrypted 256-bit Secure Payment Gateway</span>
          </div>
        </div>

        {/* Order Summary Right */}
        <div style={{ background: '#090d16', padding: '2rem', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Summary
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto', marginBottom: '1.25rem' }}>
              {cartItems.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                    {item.qty}x {item.name}
                  </span>
                  <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Items Subtotal</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Tax (10%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping Fee</span>
                <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total Pay</span>
              <span style={{ color: '#34d399' }}>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '1.5rem' }}
            disabled={loading}
          >
            <CreditCard size={18} />
            <span>{loading ? 'Processing...' : 'Confirm & Pay'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
