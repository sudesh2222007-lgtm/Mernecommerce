import { Link } from "react-router-dom";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import StarRating from "./StarRating";
import { useCart } from "../context/CartContext";
import { formatPrice, discountPercent } from "../utils/format";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const off = discountPercent(product.mrp, product.price);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.countInStock === 0) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-card-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-card-category">{product.category}</span>
        {off > 0 && <span className="discount-ribbon">{off}% OFF</span>}
        
        {product.countInStock > 0 ? (
          <button
            type="button"
            className={`quick-add-btn ${justAdded ? "added" : ""}`}
            onClick={handleQuickAdd}
            title="Add to cart"
          >
            {justAdded ? (
              <>
                <Check size={16} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Quick Add
              </>
            )}
          </button>
        ) : (
          <span className="sold-out-overlay">Sold Out</span>
        )}
      </Link>

      <div className="product-card-body">
        <div className="product-card-meta-top">
          <span className="product-card-brand">{product.brand || "Norra Atelier"}</span>
          <span
            className={`stock-pill ${
              product.countInStock > 0 ? "in-stock" : "out-stock"
            }`}
          >
            {product.countInStock > 5
              ? "In Stock"
              : product.countInStock > 0
              ? `Only ${product.countInStock} Left`
              : "Sold Out"}
          </span>
        </div>

        <Link to={`/product/${product._id}`} className="product-card-title">
          {product.name}
        </Link>

        <StarRating rating={product.rating} numReviews={product.numReviews} />

        <div className="price-row">
          <span className="price">{formatPrice(product.price)}</span>
          {off > 0 && (
            <>
              <span className="mrp">{formatPrice(product.mrp)}</span>
              <span className="off-tag">{off}% OFF</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
