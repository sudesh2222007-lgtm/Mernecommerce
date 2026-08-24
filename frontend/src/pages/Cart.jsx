import { Link, useNavigate } from "react-router-dom";
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

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Go back</Link>
        </p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} onError={(e) => (e.target.style.display = "none")} />
                <Link to={`/product/${item._id}`}>{item.name}</Link>
                <span>{formatPrice(item.price)}</span>
                <select
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(item._id, Number(e.target.value))
                  }
                >
                  {[...Array(item.countInStock || 10).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>
              Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}) items
            </h3>
            <h3>{formatPrice(itemsPrice)}</h3>
            <button onClick={checkoutHandler}>Proceed To Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
