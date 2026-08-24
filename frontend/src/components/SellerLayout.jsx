import { NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, Package, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SellerLayout = () => {
  const { userInfo } = useAuth();

  return (
    <div className="container seller-layout">
      <div className="seller-header">
        <h1>Seller Dashboard</h1>
        <p className="hint">
          {userInfo?.storeName || userInfo?.name} —{" "}
          {userInfo?.isAdmin ? "Store Administrator" : "Seller Account"}
        </p>
      </div>

      <div className="seller-tabs">
        <NavLink
          to="/seller"
          end
          className={({ isActive }) => (isActive ? "seller-tab active" : "seller-tab")}
        >
          <LayoutGrid size={16} /> Overview
        </NavLink>
        <NavLink
          to="/seller/products"
          className={({ isActive }) => (isActive ? "seller-tab active" : "seller-tab")}
        >
          <Package size={16} /> My Products
        </NavLink>
        <NavLink
          to="/seller/orders"
          className={({ isActive }) => (isActive ? "seller-tab active" : "seller-tab")}
        >
          <ClipboardList size={16} /> Orders
        </NavLink>
      </div>

      <div className="seller-content">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerLayout;
