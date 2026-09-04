import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronRight, ShieldCheck, Truck } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import StarRating from "../components/StarRating";
import { formatPrice, discountPercent } from "../utils/format";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, Number(qty));
    navigate("/cart");
  };

  if (error) return <p className="error container">{error}</p>;
  if (!product) return <p className="container muted">Loading...</p>;

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <span>{product.category}</span>
        <ChevronRight size={14} />
        <span className="current">{product.name}</span>
      </div>

      <div className="product-details">
        <div className="details-media">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-info">
          <span className="product-card-category">{product.category}</span>
          <h1>{product.name}</h1>
          <StarRating rating={product.rating} numReviews={product.numReviews} />

          <div className="price-row">
            <p className="price large">{formatPrice(product.price)}</p>
            {discountPercent(product.mrp, product.price) > 0 && (
              <>
                <span className="mrp">{formatPrice(product.mrp)}</span>
                <span className="off-tag">
                  {discountPercent(product.mrp, product.price)}% off
                </span>
              </>
            )}
          </div>
          <p className="hint" style={{ marginTop: "-8px" }}>
            inclusive of all taxes
          </p>
          <p className="details-description">{product.description}</p>

          <div className="details-meta">
            <span>
              <strong>Brand:</strong> {product.brand}
            </span>
            <span
              className={`stock-pill ${
                product.countInStock > 0 ? "in-stock" : "out-stock"
              }`}
            >
              {product.countInStock > 0
                ? `${product.countInStock} in stock`
                : "Out of Stock"}
            </span>
          </div>

          {product.countInStock > 0 && (
            <div className="qty-selector">
              <label>Quantity</label>
              <select value={qty} onChange={(e) => setQty(e.target.value)}>
                {[...Array(Math.min(product.countInStock, 10)).keys()].map(
                  (x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <button
            className="btn-primary"
            disabled={product.countInStock === 0}
            onClick={handleAddToCart}
          >
            Add To Cart
          </button>

          <div className="trust-row">
            <span>
              <Truck size={16} /> Free shipping over ₹2,000
            </span>
            <span>
              <ShieldCheck size={16} /> Secure checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
