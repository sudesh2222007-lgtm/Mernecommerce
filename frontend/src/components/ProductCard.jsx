import { memo } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import StarRating from "./StarRating";
import { useCart } from "../context/CartContext";
import { formatPrice, discountPercent } from "../utils/format";

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const off = discountPercent(product.mrp, product.price);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-media">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <span className="product-card-category">{product.category}</span>
        {off > 0 && <span className="discount-ribbon">{off}% OFF</span>}
        {product.countInStock > 0 && (
          <button
            type="button"
            className="quick-add-btn"
            onClick={handleQuickAdd}
            title="Add to cart"
          >
            <ShoppingCart size={16} />
            Quick Add
          </button>
        )}
      </Link>

      <div className="product-card-body">
        <Link to={`/product/${product._id}`} className="product-card-title">
          {product.name}
        </Link>
        <StarRating rating={product.rating} numReviews={product.numReviews} />
        <div className="price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {off > 0 && (
            <>
              <span className="mrp">{formatPrice(product.mrp)}</span>
              <span className="off-tag">{off}% off</span>
            </>
          )}
        </div>
        <div className="product-card-footer">
          <span
            className={`stock-pill ${
              product.countInStock > 0 ? "in-stock" : "out-stock"
            }`}
          >
            {product.countInStock > 0 ? "In Stock" : "Sold Out"}
          </span>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
