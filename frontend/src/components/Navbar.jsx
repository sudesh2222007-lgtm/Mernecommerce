import React from 'react';
import { ShoppingBag, Search, User, LogOut, ShieldCheck, PackageCheck, Sparkles } from 'lucide-react';

export default function Navbar({
  user,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onLogout,
  onOpenOrders,
  onOpenAdmin,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px var(--primary-glow)',
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AURA
            </h1>
            <span style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginTop: '-4px' }}>
              E-COMMERCE
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search audio, watches, fashion, home..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.7rem 1rem 0.7rem 2.8rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'var(--transition)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Admin Button if user is admin */}
          {user?.isAdmin && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenAdmin} title="Admin Portal">
              <ShieldCheck size={16} color="#818cf8" />
              <span>Admin</span>
            </button>
          )}

          {/* User Orders button if logged in */}
          {user && (
            <button className="btn btn-secondary btn-sm" onClick={onOpenOrders} title="My Orders">
              <PackageCheck size={16} />
              <span>Orders</span>
            </button>
          )}

          {/* Cart Icon */}
          <button
            className="btn btn-secondary"
            onClick={onOpenCart}
            style={{ position: 'relative', padding: '0.65rem' }}
            title="Shopping Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: 'linear-gradient(135deg, #ec4899, #ef4444)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.5)',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--primary)', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.name.split(' ')[0]}</span>
              <button className="btn btn-secondary btn-sm" onClick={onLogout} title="Logout" style={{ padding: '0.5rem' }}>
                <LogOut size={16} color="var(--danger)" />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onOpenAuth}>
              <User size={18} />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
