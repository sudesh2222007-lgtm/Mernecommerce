import React from 'react';
import { Star, ShoppingBag, Eye } from 'lucide-react';

export default function ProductCard({ product, onQuickView, onAddToCart }) {
  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'var(--transition)',
        position: 'relative',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      {/* Category Pill Badge */}
      <span
        style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          zIndex: 2,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          padding: '0.25rem 0.6rem',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#cbd5e1',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {product.category}
      </span>

      {/* Image Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '75%', // 4:3 Aspect ratio
          overflow: 'hidden',
          background: '#0f172a',
          cursor: 'pointer',
        }}
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
      </div>

      {/* Product Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
              {product.brand}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700 }}>
              <Star size={14} fill="var(--gold)" />
              <span>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({product.numReviews})</span>
            </div>
          </div>

          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              marginBottom: '0.5rem',
              lineHeight: 1.3,
              height: '2.6em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              cursor: 'pointer',
            }}
            onClick={() => onQuickView(product)}
          >
            {product.name}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', pt: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Price</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onQuickView(product)}
              title="Quick View"
              style={{ padding: '0.55rem' }}
            >
              <Eye size={16} />
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onAddToCart(product)}
              title="Add to Cart"
            >
              <ShoppingBag size={16} />
              <span>Add</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
