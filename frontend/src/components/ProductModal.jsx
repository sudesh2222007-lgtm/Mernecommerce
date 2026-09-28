import React from 'react';
import { X, Star, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

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
        zIndex: 2000,
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
          maxWidth: '850px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 10,
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {/* Product Image Left */}
        <div style={{ background: '#090d16', height: '100%', minHeight: '380px', position: 'relative' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Details Right */}
        <div style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">{product.category}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Brand: {product.brand}</span>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.2 }}>
              {product.name}
            </h2>

            {/* Rating & Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating) ? 'var(--gold)' : 'none'}
                    color="var(--gold)"
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{product.rating}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({product.numReviews} customer reviews)</span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Stock status */}
            <div style={{ marginBottom: '1.5rem' }}>
              {product.countInStock > 0 ? (
                <span className="badge badge-success">In Stock ({product.countInStock} available)</span>
              ) : (
                <span className="badge badge-warning">Out of Stock</span>
              )}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ${product.price.toFixed(2)}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Free Express Shipping</span>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem' }}
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              disabled={product.countInStock <= 0}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
