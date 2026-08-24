import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, AlertTriangle, PackageX } from "lucide-react";
import api from "../../api/axios";

const SellerDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await api.get("/seller/summary");
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard");
      }
    };
    fetchSummary();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!summary) return <p>Loading...</p>;

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card">
          <Package size={22} />
          <div>
            <h3>{summary.totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <AlertTriangle size={22} />
          <div>
            <h3>{summary.lowStock}</h3>
            <p>Low Stock (≤5 units)</p>
          </div>
        </div>
        <div className="stat-card">
          <PackageX size={22} />
          <div>
            <h3>{summary.outOfStock}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
      </div>

      <div className="seller-quick-actions">
        <Link to="/seller/products" className="btn-pill">
          + Add a Product
        </Link>
        <Link to="/seller/orders" className="btn-pill secondary">
          View Orders
        </Link>
      </div>
    </div>
  );
};

export default SellerDashboard;
