import React from 'react';
import { ShoppingBag, Package, User, LogOut, Shield } from 'lucide-react';

export default function Navbar({
  cartCount,
  onOpenCart,
  user,
  onOpenAuth,
  onLogout,
  onOpenOrders,
  onOpenAdmin,
}) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="brand-icon-box">N</div>
        <span>Norra</span>
      </div>

      <div className="nav-actions">
        <button className="nav-item-btn" onClick={onOpenOrders}>
          <Package size={18} />
          <span>Orders</span>
        </button>

        <button className="nav-item-btn" onClick={onOpenCart}>
          <ShoppingBag size={18} />
          <span>Cart</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {user ? (
          <>
            <button className="nav-item-btn" onClick={onOpenOrders} style={{ color: 'white' }}>
              <User size={18} />
              <span>{user.name}</span>
            </button>

            {user.isAdmin && (
              <button className="nav-item-btn" onClick={onOpenAdmin} style={{ color: '#10b981' }}>
                <Shield size={18} />
                <span>Admin</span>
              </button>
            )}

            <button className="nav-item-btn" onClick={onLogout} title="Sign Out">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <button className="nav-item-btn" onClick={onOpenAuth}>
            <User size={18} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
