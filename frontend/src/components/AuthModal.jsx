import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon } from 'lucide-react';
import { loginApi, registerApi } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await loginApi(email, password);
        showToast(`Welcome back, ${data.name}! 👋`);
      } else {
        data = await registerApi(name, email, password);
        showToast('Account created successfully! Welcome to AURA ✨');
      }
      onAuthSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setEmail(role === 'admin' ? 'admin@example.com' : 'customer@example.com');
    setPassword(role === 'admin' ? 'adminpassword123' : 'customerpassword123');
    setIsLogin(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="btn-close" onClick={onClose}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          {isLogin ? 'Sign In to Your Account' : 'Create a New Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {isLogin ? 'Enter your credentials to access your store orders.' : 'Sign up today to explore exclusive products.'}
        </p>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sudesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', textAlign: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quick Demo Logins:</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              onClick={() => handleQuickDemo('admin')}
              style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(99,102,241,0.2)', border: '1px solid var(--primary)', color: '#a5b4fc', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Fill Admin Demo
            </button>
            <button
              onClick={() => handleQuickDemo('user')}
              style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#6ee7b7', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              Fill Customer Demo
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
