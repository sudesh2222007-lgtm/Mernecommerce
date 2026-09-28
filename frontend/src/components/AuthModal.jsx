import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { loginApi, registerApi } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, showToast }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let data;
      if (isLogin) {
        data = await loginApi(email, password);
        showToast('Successfully logged in!', 'success');
      } else {
        data = await registerApi(name, email, password);
        showToast('Account created successfully!', 'success');
      }
      localStorage.setItem('aura_token', data.token);
      onAuthSuccess(data);
      onClose();
    } catch (err) {
      showToast(err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@example.com');
      setPassword('adminpassword123');
      setIsLogin(true);
    } else {
      setEmail('user@example.com');
      setPassword('userpassword123');
      setIsLogin(true);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 4000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '440px',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 2rem',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
          }}>
            <Sparkles size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {isLogin ? 'Enter your credentials to access your account' : 'Join Aura to manage orders & checkout'}
          </p>
        </div>

        {/* Demo Login Buttons for convenience */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, fontSize: '0.75rem' }}
            onClick={() => handleDemoFill('user')}
          >
            Demo Customer
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, fontSize: '0.75rem', borderColor: 'var(--primary)' }}
            onClick={() => handleDemoFill('admin')}
          >
            Demo Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-color)',
                  color: 'white',
                  outline: 'none',
                }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-color)',
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <button className="btn btn-primary" type="submit" style={{ marginTop: '0.5rem', padding: '0.85rem' }} disabled={loading}>
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: 700, marginLeft: '0.4rem', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
