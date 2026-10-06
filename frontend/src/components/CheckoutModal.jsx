import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createOrderApi } from '../services/api';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  user,
  token,
  onOrderSuccess,
  showToast,
}) {
  const [address, setAddress] = useState('123 Main Road, Anna Nagar');
  const [city, setCity] = useState('Chennai');
  const [postalCode, setPostalCode] = useState('600040');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 2000 ? 0 : 99;
  const taxPrice = itemsPrice * 0.05;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
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

      const createdOrder = await createOrderApi(orderData, token);
      showToast('🎉 Order placed successfully! Track in Orders tab.');
      onOrderSuccess(createdOrder);
      onClose();
    } catch (error) {
      showToast(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <button className="btn-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Checkout & Delivery</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Enter your shipping details below to place your order.
        </p>

        <form onSubmit={handlePlaceOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Postal Code</label>
              <input
                type="text"
                className="form-input"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-input"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="UPI / GPay / PhonePe">UPI / GPay / PhonePe</option>
              <option value="Credit / Debit Card">Credit / Debit Card</option>
            </select>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '1.25rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', marginBottom: '0.4rem' }}>
              <span>Items Total</span>
              <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', marginBottom: '0.4rem' }}>
              <span>Shipping Fee</span>
              <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem' }}>
              <span>GST (5%)</span>
              <span>₹{taxPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
              <span>Total Amount</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button className="btn-primary-black" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order (₹${totalPrice.toLocaleString('en-IN')})`}
          </button>
        </form>
      </div>
    </div>
  );
}
