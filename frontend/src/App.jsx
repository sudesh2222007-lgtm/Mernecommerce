import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ToastNotification from './components/ToastNotification';

export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_info');
    return saved ? JSON.parse(saved) : { name: 'Sudesh', email: 'sudesh@example.com', token: 'demo_token' };
  });

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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              cartItems={cart}
              onAddToCart={handleAddToCart}
              user={user}
              onLogout={handleLogout}
              onOpenOrders={() => setIsOrdersOpen(true)}
              onOpenAdmin={() => setIsAdminOpen(true)}
              showToast={showToast}
              isOrdersOpen={isOrdersOpen}
              setIsOrdersOpen={setIsOrdersOpen}
              isAdminOpen={isAdminOpen}
              setIsAdminOpen={setIsAdminOpen}
            />
          }
        />
        <Route
          path="/login"
          element={<Login onAuthSuccess={handleAuthSuccess} showToast={showToast} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cart}
              onUpdateQty={handleUpdateCartQty}
              onRemoveItem={handleRemoveCartItem}
              user={user}
              onLogout={handleLogout}
              onOpenOrders={() => setIsOrdersOpen(true)}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              cartItems={cart}
              user={user}
              onOrderSuccess={() => setCart([])}
              showToast={showToast}
              onLogout={handleLogout}
              onOpenOrders={() => setIsOrdersOpen(true)}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />
          }
        />
      </Routes>
      <ToastNotification toasts={toasts} />
    </BrowserRouter>
  );
}
