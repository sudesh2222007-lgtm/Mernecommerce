import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  PackageSearch,
  User,
  LogOut,
  Menu,
  X,
  Store,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      {/* Top Luxury Announcement Strip */}
      <div className="navbar-top-strip">
        <div className="navbar-top-inner">
          <span className="top-strip-left">
            <Sparkles size={13} className="text-gold" />
            <span>Complimentary Express Shipping on Orders Above ₹1,999</span>
          </span>
          <span className="top-strip-right">NORRA EDIT 2026</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="navbar-inner">
        {/* Brand Name */}
        <Link to="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
          <img src="/favicon.svg" alt="NORRA Logo" className="brand-logo-mark" />
          <span className="brand-name">
            NORRA <span className="brand-badge-ecom">ECOM</span>
          </span>
        </Link>

        {/* Mobile Actions: Cart & Menu Button */}
        <div className="mobile-actions">
          <Link
            to="/cart"
            className="nav-link cart-link mobile-cart-icon"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag size={21} />
            {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
          </Link>
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Catalog
          </Link>

          {userInfo && (
            <Link
              to="/orders"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <PackageSearch size={17} />
              <span>Orders</span>
            </Link>
          )}

          {userInfo && (userInfo.isSeller || userInfo.isAdmin) && (
            <Link
              to="/seller"
              className="nav-link seller-badge-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Store size={17} />
              <span>Seller Studio</span>
            </Link>
          )}

          <Link
            to="/cart"
            className="nav-link cart-link desktop-cart-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag size={18} />
            <span>Cart</span>
            {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
          </Link>

          {userInfo ? (
            <div className="nav-user-group">
              <span className="nav-user">
                <User size={15} />
                <span>{userInfo.name.split(" ")[0]}</span>
              </span>
              <button
                onClick={handleLogout}
                className="icon-btn logout-btn"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="nav-user-group">
              <Link
                to="/login"
                className="nav-link signin-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-pill"
                onClick={() => setMobileMenuOpen(false)}
              >
                Join Norra
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
