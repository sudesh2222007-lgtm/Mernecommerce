import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../utils/format";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, itemsPrice } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  const totalQty = cartItems.reduce((a, c) => a + c.qty, 0);

  return (
    <div className="container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        {cartItems.length > 0 && (
          <span className="cart-count-badge">
            {totalQty} {totalQty === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <ShoppingBag size={54} className="cart-empty-icon" />
          <h2>Your cart is empty</h2>
          <p className="muted">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn-primary cart-empty-btn">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <Link to={`/product/${item._id}`} className="cart-item-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </Link>

                <div className="cart-item-info">
                  <div className="cart-item-header">
                    <Link to={`/product/${item._id}`} className="cart-item-title">
                      {item.name}
                    </Link>
                    <span className="cart-item-price">{formatPrice(item.price)}</span>
                  </div>

                  <div className="cart-item-controls">
                    <div className="cart-item-qty">
                      <label htmlFor={`qty-${item._id}`}>Qty:</label>
                      <select
                        id={`qty-${item._id}`}
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(item._id, Number(e.target.value))
                        }
                      >
                        {[...Array(Math.min(Math.max(1, item.countInStock || 10), 10)).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item._id)}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>
              Subtotal ({totalQty}) {totalQty === 1 ? "item" : "items"}
            </h3>
            <div className="cart-summary-price">{formatPrice(itemsPrice)}</div>
            <button onClick={checkoutHandler} className="btn-checkout">
              Proceed To Checkout <ArrowRight size={17} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

