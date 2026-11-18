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
      const sorted = (Array.isArray(data) ? [...data] : []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
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
          {orders.map((order, idx) => (
            <div key={order._id} className="seller-order-card">
              <div className="seller-order-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                    <strong style={{ fontSize: "1.05rem", color: "var(--text)" }}>Order #{order._id.slice(-8).toUpperCase()}</strong>
                    {idx === 0 && (
                      <span style={{ fontSize: "0.72rem", padding: "2px 8px", background: "rgba(217,119,6,0.12)", color: "#b45309", border: "1px solid rgba(217,119,6,0.25)", borderRadius: "10px", fontWeight: "600" }}>
                        ★ Latest Order
                      </span>
                    )}
                    <span style={{ fontSize: "0.78rem", padding: "2px 8px", background: "#f3f4f6", borderRadius: "12px", color: "#6b7280" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="order-buyer-info" style={{ margin: "4px 0 2px 0", fontSize: "0.92rem", color: "var(--text)" }}>
                    <span style={{ color: "#718096", fontWeight: "500" }}>Buyer:</span>{" "}
                    <strong style={{ color: "#b7791f", fontWeight: "600" }}>
                      {order.buyerName || order.user?.name || (typeof order.user === "string" ? order.user : "Customer")}
                    </strong>
                    {(order.buyerEmail || order.user?.email) && (
                      <span style={{ color: "#718096", fontSize: "0.85rem" }}> ({order.buyerEmail || order.user?.email})</span>
                    )}
                  </p>
                  <p style={{ margin: "2px 0 6px 0", fontSize: "0.88rem", color: "var(--text)" }}>
                    <span style={{ color: "#718096", fontWeight: "500" }}>Mobile:</span>{" "}
                    <strong style={{ color: "#2d3748", fontWeight: "600" }}>
                      {order.buyerMobile || order.shippingAddress?.mobile || order.mobile || order.user?.mobile || "+91 98765 43210"}
                    </strong>
                  </p>
                </div>
                <div className="seller-order-status">
                  <span className={order.isPaid ? "off-tag" : "error"}>
                    {order.isPaid ? "Paid" : "Payment Pending"}
                  </span>
                </div>
              </div>

              <p className="hint" style={{ marginTop: "6px" }}>
                <strong>Ship to:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}{" "}
                {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
              </p>

              <div className="seller-order-items">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80";
                      }}
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
