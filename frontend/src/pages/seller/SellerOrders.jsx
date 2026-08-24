import { useEffect, useState } from "react";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/seller/orders");
      setOrders(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markDelivered = async (orderId, itemId) => {
    try {
      await api.put(`/seller/orders/${orderId}/items/${itemId}/deliver`);
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update item");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Orders Containing Your Products ({orders.length})</h2>

      {orders.length === 0 ? (
        <p>No orders yet. Once a customer buys one of your products, it'll show up here.</p>
      ) : (
        <div className="seller-orders-list">
          {orders.map((order) => (
            <div key={order._id} className="seller-order-card">
              <div className="seller-order-header">
                <div>
                  <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                  <p className="hint">
                    Placed by {order.user?.name || "Customer"} on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="seller-order-status">
                  <span className={order.isPaid ? "off-tag" : "error"}>
                    {order.isPaid ? "Paid" : "Payment Pending"}
                  </span>
                </div>
              </div>

              <p className="hint">
                Ship to: {order.shippingAddress?.address}, {order.shippingAddress?.city}{" "}
                {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
              </p>

              <div className="seller-order-items">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => (e.target.style.visibility = "hidden")}
                    />
                    <span>{item.name}</span>
                    <span>
                      {item.qty} x {formatPrice(item.price)}
                    </span>
                    {item.isDelivered ? (
                      <span className="off-tag">Delivered</span>
                    ) : (
                      <button onClick={() => markDelivered(order._id, item._id)}>
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <p className="seller-order-total">
                Your total: {formatPrice(order.myItemsTotal)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
