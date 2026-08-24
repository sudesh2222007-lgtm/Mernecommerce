import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";

const Checkout = () => {
  const { cartItems, itemsPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [error, setError] = useState("");

  const shippingPrice = itemsPrice > 2000 ? 0 : 99;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(0));
  const totalPrice = Number(itemsPrice + shippingPrice + taxPrice);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    try {
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id,
      }));

      const { data } = await api.post("/orders", {
        orderItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    }
  };

  if (cartItems.length === 0) {
    return <p className="container">Your cart is empty.</p>;
  }

  return (
    <div className="container form-container">
      <h1>Checkout</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={placeOrderHandler}>
        <label>Address</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} required />
        <label>City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} required />
        <label>PIN Code</label>
        <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        <label>Country</label>
        <input value={country} onChange={(e) => setCountry(e.target.value)} required />

        <label>Payment Method</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option>Cash on Delivery</option>
          <option>UPI</option>
          <option>Credit / Debit Card</option>
          <option>Net Banking</option>
        </select>

        <div className="order-summary">
          <p>Items: {formatPrice(itemsPrice)}</p>
          <p>Shipping: {shippingPrice === 0 ? "FREE" : formatPrice(shippingPrice)}</p>
          <p>GST (5%): {formatPrice(taxPrice)}</p>
          <h3>Total: {formatPrice(totalPrice)}</h3>
        </div>

        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default Checkout;
