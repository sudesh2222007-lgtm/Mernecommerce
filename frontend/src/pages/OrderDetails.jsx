import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { formatPrice } from "../utils/format";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load order");
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const markAsPaid = async () => {
    await api.put(`/orders/${id}/pay`);
    fetchOrder();
  };

  if (error) return <p className="error container">{error}</p>;
  if (!order) return <p className="container">Loading...</p>;

  return (
    <div className="container order-details">
      <h1>Order {order._id}</h1>

      <div className="order-section">
        <h3>Shipping</h3>
        <p>
          {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
        <p>Status: {order.isDelivered ? "Delivered" : "Not Delivered"}</p>
      </div>

      <div className="order-section">
        <h3>Payment Method</h3>
        <p>{order.paymentMethod}</p>
        <p>Status: {order.isPaid ? "Paid" : "Not Paid"}</p>
        {!order.isPaid && <button onClick={markAsPaid}>Mark As Paid (Demo)</button>}
      </div>

      <div className="order-section">
        <h3>Order Items</h3>
        {order.orderItems.map((item, idx) => (
          <div key={idx} className="cart-item">
            <img src={item.image} alt={item.name} onError={(e) => (e.target.style.display = "none")} />
            <span>{item.name}</span>
            <span>
              {item.qty} x {formatPrice(item.price)} ={" "}
              {formatPrice(item.qty * item.price)}
            </span>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <p>Items: {formatPrice(order.itemsPrice)}</p>
        <p>Shipping: {order.shippingPrice === 0 ? "FREE" : formatPrice(order.shippingPrice)}</p>
        <p>GST: {formatPrice(order.taxPrice)}</p>
        <h3>Total: {formatPrice(order.totalPrice)}</h3>
      </div>
    </div>
  );
};

export default OrderDetails;
