import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <div style={{ padding: '3rem 0 2rem 0', position: 'relative' }}>
      {/* Subtle Glow background */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="glass-panel" style={{
          borderRadius: 'var(--radius-lg)',
          padding: '3.5rem 3rem',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2.5rem',
          alignItems: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}>
          
          {/* Left Column Content */}
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>
              ⚡ Summer Collection 2026
            </span>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.2rem',
              letterSpacing: '-1px',
            }}>
              Discover Next-Gen <br />
              <span style={{
                background: 'linear-gradient(90deg, #818cf8, #c084fc, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Premium Lifestyle
              </span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '480px' }}>
              Explore handpicked audio gear, flagship smartwatches, artisan fashion, and curated home aesthetics backed by official warranty.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={onExploreClick} style={{ padding: '0.85rem 2rem' }}>
                <span>Shop Catalogue</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Feature Badges */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.5rem', pt: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Truck size={18} color="#818cf8" />
                <span>Express Delivery</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <ShieldCheck size={18} color="#34d399" />
                <span>100% Authentic</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <RotateCcw size={18} color="#fcd34d" />
                <span>Easy 30-Day Return</span>
              </div>
            </div>
          </div>

          {/* Right Column Image Banner */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxHeight: '340px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="Flagship Headphones"
                style={{ width: '100%', height: '340px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                padding: '1rem',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Aura Studio Wireless</h4>
                  <span style={{ fontSize: '0.8rem', color: '#818cf8' }}>Spatial Audio • Active Noise Cancel</span>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>$249.99</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
