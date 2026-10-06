import React from 'react';
import { Star } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onSelectProduct }) {
  return (
    <div className="product-card">
      <div className="card-image-box" onClick={() => onSelectProduct(product)}>
        <img src={product.image} alt={product.name} className="card-img" />
        <span className="category-tag-badge">{product.category}</span>
      </div>

      <div className="card-details">
        <h3 className="card-product-title" onClick={() => onSelectProduct(product)}>
          {product.name}
        </h3>

        <div className="card-rating-row">
          <div className="star-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(product.rating) ? '#eab308' : 'none'}
                color={i < Math.floor(product.rating) ? '#eab308' : '#cbd5e1'}
              />
            ))}
          </div>
          <span>({product.numReviews})</span>
        </div>

        <div className="card-bottom-row">
          <span className="card-price-text">₹{product.price.toLocaleString('en-IN')}</span>
          <button
            className="in-stock-pill"
            onClick={() => onAddToCart(product)}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            IN STOCK
          </button>
        </div>
      </div>
    </div>
  );
}
