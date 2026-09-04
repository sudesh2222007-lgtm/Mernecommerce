import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut, PackageSearch, Store } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">N</span>
          <span className="brand-name">Norra</span>
        </Link>

        <nav className="nav-links">
          {userInfo && (
            <Link to="/orders" className="nav-link">
              <PackageSearch size={18} />
              <span>Orders</span>
            </Link>
          )}

          {userInfo && (userInfo.isSeller || userInfo.isAdmin) && (
            <Link to="/seller" className="nav-link">
              <Store size={18} />
              <span>Seller Dashboard</span>
            </Link>
          )}

          <Link to="/cart" className="nav-link cart-link">
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
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/register" className="btn-pill">
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
