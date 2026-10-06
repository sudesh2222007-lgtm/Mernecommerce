import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import CheckoutModal from './components/CheckoutModal';
import MyOrdersModal from './components/MyOrdersModal';
import AdminPanel from './components/AdminPanel';
import ToastNotification from './components/ToastNotification';
import { fetchProducts } from './services/api';

const DEFAULT_PRODUCTS = [
  {
    _id: '1',
    name: 'Voyage Travel Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Accessories',
    description: 'Durable water-resistant canvas and full-grain leather laptop backpack designed for daily travel and commutes.',
    rating: 4.2,
    numReviews: 19,
    price: 24.99,
    countInStock: 15,
    featured: true,
  },
  {
    _id: '2',
    name: 'Horizon Polarized Sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Accessories',
    description: 'Classic matte black frame with UV400 polarized anti-glare lenses.',
    rating: 4.5,
    numReviews: 8,
    price: 34.50,
    countInStock: 25,
    featured: true,
  },
  {
    _id: '3',
    name: 'Frame Mirrorless Camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Electronics',
    description: 'Full-frame mirrorless digital camera with 4K video capabilities and 24.2MP sensor.',
    rating: 4.8,
    numReviews: 41,
    price: 549.00,
    countInStock: 8,
    featured: true,
  },
  {
    _id: '4',
    name: 'Boom Portable Speaker',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Electronics',
    description: 'IPX7 waterproof portable Bluetooth speaker with deep bass acoustic sound.',
    rating: 4.4,
    numReviews: 22,
    price: 79.99,
    countInStock: 30,
    featured: false,
  },
  {
    _id: '5',
    name: 'Fold Leather Wallet',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Accessories',
    description: 'Genuine slim bifold leather wallet with RFID blocking layer.',
    rating: 4.3,
    numReviews: 15,
    price: 29.99,
    countInStock: 20,
    featured: false,
  },
  {
    _id: '6',
    name: 'Noise Canceling Studio Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Electronics',
    description: 'Active noise-canceling wireless over-ear headphones with 30-hour battery power.',
    rating: 4.9,
    numReviews: 34,
    price: 199.99,
    countInStock: 12,
    featured: true,
  },
  {
    _id: '7',
    name: 'Nike Flyknit Speed Running Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    brand: 'Nike',
    category: 'Footwear',
    description: 'Lightweight breathable knitted mesh running shoes with responsive cushioning.',
    rating: 4.7,
    numReviews: 28,
    price: 129.99,
    countInStock: 18,
    featured: true,
  },
  {
    _id: '8',
    name: 'Minimalist White Smartwatch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    brand: 'Norra',
    category: 'Electronics',
    description: 'Sleek white silicone smart wrist watch with heart rate and activity tracking.',
    rating: 4.6,
    numReviews: 17,
    price: 149.00,
    countInStock: 14,
    featured: false,
  },
];

export default function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_info');
    return saved ? JSON.parse(saved) : { name: 'Bhagya', email: 'bhagya@example.com', token: 'demo' };
  });

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const loadProducts = () => {
    fetchProducts(selectedCategory, searchTerm)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.log('Using default client products fallback:', err);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchTerm]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);
      if (exists) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
    showToast(`Added ${product.name} to cart 🛒`);
  };

  const handleUpdateCartQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveCartItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user_info', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user_info');
    showToast('Signed out successfully.');
  };

  const categories = ['All', 'Electronics', 'Footwear', 'Accessories'];

  return (
    <div className="app-container">
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchSubmit={loadProducts}
      />

      <main className="main-content">
        <div className="category-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="section-header">
          <h2 className="section-title">
            {selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory} Collection`}
          </h2>
          <span className="section-item-count">{products.length} items</span>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onSelectProduct={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #e2e8f0', background: 'white', padding: '2.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
        <p>© 2026 Norra E-Commerce Platform. Built with Node.js, Express, MongoDB & React.</p>
      </footer>

      {/* Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          if (!user) {
            setIsAuthOpen(true);
            showToast('Please sign in to complete your checkout');
          } else {
            setIsCheckoutOpen(true);
          }
        }}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        user={user}
        token={user?.token}
        onOrderSuccess={() => setCart([])}
        showToast={showToast}
      />

      <MyOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        token={user?.token}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        token={user?.token}
        products={products}
        onRefreshProducts={loadProducts}
        showToast={showToast}
      />

      <ToastNotification toasts={toasts} />
    </div>
  );
}
