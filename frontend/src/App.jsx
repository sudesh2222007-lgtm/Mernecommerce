import React from " react\;
import { BrowserRouter, Routes, Route } from \react-router-dom\;
import { AuthProvider } from \./context/AuthContext\;
import { LanguageProvider } from \./context/LanguageContext\;
import Navbar from \./components/Navbar\;
import Footer from \./components/Footer\;
import Home from \./pages/Home\;
import Products from \./pages/Products\;
import ProductDetails from \./pages/ProductDetails\;
import NearbyFarmers from \./pages/NearbyFarmers\;
import FarmerProfile from \./pages/FarmerProfile\;
import CustomerInfo from \./pages/CustomerInfo\;
import Login from \./pages/Login\;
import Register from \./pages/Register\;
import FarmerDashboard from \./pages/FarmerDashboard\;
import FarmerInfoCenter from \./pages/FarmerInfoCenter\;
import AdminPanel from \./pages/AdminPanel\;
import CustomerOrders from \./pages/CustomerOrders\;
import Favourites from \./pages/Favourites\;
import NotFound from \./pages/NotFound\;
import ProtectedRoute from \./components/ProtectedRoute\;

export default function App() {
 return (
 <AuthProvider>
 <LanguageProvider>
 <BrowserRouter>
 <div className=\min-h-screen flex flex-col bg-cream text-leaf-950 font-sans selection:bg-leaf-200 selection:text-leaf-900\>
 <Navbar />
 <main className=\flex-1\>
 <Routes>
 <Route path=\/\ element={<Home />} />
 <Route path=\/products\ element={<Products />} />
 <Route path=\/products/:id\ element={<ProductDetails />} />
 <Route path=\/nearby-farmers\ element={<NearbyFarmers />} />
 <Route path=\/farmers/:id\ element={<FarmerProfile />} />
 <Route path=\/customer-info\ element={<CustomerInfo />} />
 <Route path=\/login\ element={<Login />} />
 <Route path=\/register\ element={<Register />} />
 <Route path=\/farmer/dashboard\ element={<ProtectedRoute role=\farmer\><FarmerDashboard /></ProtectedRoute>} />
 <Route path=\/farmer/info-center\ element={<ProtectedRoute role=\farmer\><FarmerInfoCenter /></ProtectedRoute>} />
 <Route path=\/admin\ element={<ProtectedRoute role=\admin\><AdminPanel /></ProtectedRoute>} />
 <Route path=\/my-orders\ element={<ProtectedRoute role=\customer\><CustomerOrders /></ProtectedRoute>} />
 <Route path=\/favourites\ element={<ProtectedRoute><Favourites /></ProtectedRoute>} />
 <Route path=\*\ element={<NotFound />} />
 </Routes>
 </main>
 <Footer />
 </div>
 </BrowserRouter>
 </LanguageProvider>
 </AuthProvider>
 );
}