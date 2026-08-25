import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut, PackageSearch, Store, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
          <span className="brand-mark">N</span>
          <span className="brand-name">Norra</span>
        </Link>

        <div className="mobile-actions">
          <Link to="/cart" className="nav-link cart-link mobile-cart-icon" onClick={() => setMobileMenuOpen(false)}>
            <ShoppingBag size={22} />
            {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
          </Link>
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className={`nav-links ${mobileMenuOpen ? "open" : ""}`}>
          {userInfo && (
            <Link to="/orders" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <PackageSearch size={18} />
              <span>Orders</span>
            </Link>
          )}

          {userInfo && (userInfo.isSeller || userInfo.isAdmin) && (
            <Link to="/seller" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              <Store size={18} />
              <span>Seller Dashboard</span>
            </Link>
          )}

          <Link to="/cart" className="nav-link cart-link desktop-cart-link" onClick={() => setMobileMenuOpen(false)}>
            <ShoppingBag size={18} />
            <span>Cart</span>
            {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
          </Link>

          {userInfo ? (
            <div className="nav-user-group">
              <span className="nav-user">
                <User size={16} />
                {userInfo.name.split(" ")[0]}
              </span>
              <button onClick={handleLogout} className="icon-btn" title="Logout">
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div className="nav-user-group">
              <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn-pill" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

