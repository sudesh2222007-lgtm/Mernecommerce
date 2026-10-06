import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi, registerApi } from '../services/api';

export default function Login({ onAuthSuccess, showToast }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        data = await registerApi(name, email, password);
        showToast('Account created successfully!');
      } else {
        data = await loginApi(email, password);
        showToast(`Welcome back, ${data.name}!`);
      }
      if (onAuthSuccess) onAuthSuccess(data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@example.com');
    setPassword('adminpassword123');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f3f0', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Bar */}
      <div style={{ background: '#0f172a', height: '60px', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: '1.2rem' }}>
          <span style={{ background: '#ea580c', padding: '0.2rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem' }}>N</span> Norra
        </Link>
      </div>

      {/* Main Form Center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
            {isRegister ? 'Register' : 'Sign In'}
          </h1>

          {error && (
            <div style={{ padding: '0.75rem 1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0',
            }}
          >
            <form onSubmit={handleSubmit}>
              {isRegister && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.4rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                    required
                  />
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.4rem' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.4rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: '#0f172a',
                  color: 'white',
                  border: 'none',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Processing...' : isRegister ? 'Register' : 'Sign In'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '1.5rem', fontSize: '0.95rem', color: '#0f172a' }}>
            <span>{isRegister ? 'Already have an account? ' : 'New Customer? '}</span>
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ background: 'none', border: 'none', color: '#0f172a', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </div>

          <p onClick={handleFillDemo} style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>
            Demo admin: admin@example.com / adminpassword123
          </p>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div style={{ background: '#0f172a', height: '60px' }}></div>
    </div>
  );
}
