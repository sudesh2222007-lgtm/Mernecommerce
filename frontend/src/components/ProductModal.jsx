import React from 'react';
import { X, Star, ShoppingBag, CheckCircle } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <button className="btn-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '16px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span className="card-category">{product.category}</span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.5rem 0' }}>{product.name}</h2>
            
            <div className="card-rating" style={{ marginBottom: '1rem' }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <span>{product.rating} ({product.numReviews} customer reviews)</span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <CheckCircle size={16} />
              <span>In Stock ({product.countInStock} items remaining)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <button
                className="btn-primary"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ShoppingBag size={18} /> Add to Shopping Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
