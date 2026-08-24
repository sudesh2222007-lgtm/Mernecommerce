import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { formatPrice } from "../utils/format";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load orders");
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container">
      <h1>My Orders</h1>
      {error && <p className="error">{error}</p>}
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{formatPrice(order.totalPrice)}</td>
                <td>{order.isPaid ? "✅" : "❌"}</td>
                <td>{order.isDelivered ? "✅" : "❌"}</td>
                <td>
                  <Link to={`/orders/${order._id}`}>Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
