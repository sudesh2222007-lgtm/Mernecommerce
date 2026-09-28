import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';
import MyOrdersModal from './components/MyOrdersModal';
import ToastNotification from './components/ToastNotification';
import { fetchProducts, fetchCategories } from './services/api';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#f8fafc', background: '#0b0f19', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>Something went wrong</h1>
          <p style={{ color: '#94a3b8', maxWidth: '500px', marginBottom: '2rem' }}>
            {this.state.error?.toString() || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '0.75rem 1.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            Reload Website
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // User & Auth
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Cart
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    // Check saved user token session
    const savedToken = localStorage.getItem('aura_token');
    if (savedToken) {
      fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data._id) setUser(data);
        })
        .catch(() => localStorage.removeItem('aura_token'));
    }
  }, [selectedCategory, searchTerm]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(searchTerm, selectedCategory);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
      showToast('Connecting to backend server...', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : ['All']);
    } catch (err) {
      console.error(err);
      setCategories(['All']);
    }
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
    showToast('Item removed from cart', 'error');
  };

  const handleLogout = () => {
    localStorage.removeItem('aura_token');
    setUser(null);
    showToast('Signed out successfully', 'success');
  };

  const handleCheckoutTrigger = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      showToast('Please sign in to proceed with checkout', 'error');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order) => {
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Navigation */}
      <Navbar
        user={user}
        cartCount={cart.reduce((acc, item) => acc + item.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Page Area */}
      <main style={{ flex: 1 }}>
        <Hero onExploreClick={() => {
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }} />

        {/* Catalog Section */}
        <section id="catalog-section" className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
          
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Explore Products</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Showing {products.length} handpicked premium items</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', borderRadius: '30px' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading inventory from MongoDB backend...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>No products found</p>
              <span style={{ fontSize: '0.9rem' }}>Try clearing filters or search term.</span>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(p) => setSelectedProduct(p)}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

        </section>
      </main>

      {/* Footer */}
      <footer className="glass-panel" style={{ borderTop: '1px solid var(--border-color)', padding: '2.5rem 0', textAlign: 'center', marginTop: 'auto' }}>
        <div className="container">
          <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>AURA E-Commerce — Full MERN Stack Application</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Built with React, Vite, Node.js, Express.js, MongoDB Compass, Mongoose & REST API
          </p>
        </div>
      </footer>

      {/* Interactive Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutTrigger}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
        showToast={showToast}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        user={user}
        onOrderSuccess={handleOrderSuccess}
        showToast={showToast}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onRefreshProducts={loadProducts}
        showToast={showToast}
      />

      <MyOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        showToast={showToast}
      />

      <ToastNotification toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
