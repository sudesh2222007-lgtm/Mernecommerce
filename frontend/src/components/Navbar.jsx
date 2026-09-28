import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { userInfo, logout } = useAuth();
  const { lang, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-glass border-b border-leaf-100">
      {/* Top Banner Language Selector Bar */}
      <div className="bg-leaf-900 text-white text-xs py-1.5 px-4 sm:px-6 flex items-center justify-between border-b border-leaf-800">
        <div className="flex items-center gap-2 font-medium">
          <span className="opacity-80">🌾 Uzhavan Sandhai - Direct Farmer Market</span>
        </div>
        <div className="flex items-center gap-1.5 bg-leaf-800/80 p-0.5 rounded-lg border border-leaf-700">
          <button
            onClick={() => toggleLanguage("ta")}
            className={`px-2.5 py-0.5 rounded-md font-bold transition-all ${
              lang === "ta" ? "bg-emerald-500 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            தமிழ்
          </button>
          <button
            onClick={() => toggleLanguage("en")}
            className={`px-2.5 py-0.5 rounded-md font-bold transition-all ${
              lang === "en" ? "bg-emerald-500 text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            English
          </button>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl text-leaf-700">
          <span>🌾</span> {lang === "ta" ? "உழவன் சந்தை" : "Uzhavan Sandhai"}
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-leaf-900">
          <Link to="/" className="hover:text-leaf-600">
            {lang === "ta" ? "முகப்பு" : "Home"}
          </Link>
          <Link to="/cart" className="hover:text-leaf-600">
            {lang === "ta" ? "கார்ட்" : "Cart"}
          </Link>
          <Link to="/orders" className="hover:text-leaf-600">
            {lang === "ta" ? "ஆர்டர்கள்" : "Orders"}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {userInfo ? (
            <>
              <span className="text-sm font-medium">{userInfo.name}</span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="btn-primary"
              >
                {lang === "ta" ? "வெளியேறு" : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                {lang === "ta" ? "உள்நுழை" : "Login"}
              </Link>
              <Link to="/register" className="btn-primary hidden sm:inline-block">
                {lang === "ta" ? "பதிவு செய்" : "Register"}
              </Link>
            </>
          )}
          <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
            ☰
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4 text-sm font-medium text-leaf-900">
          <Link to="/" onClick={() => setOpen(false)}>
            {lang === "ta" ? "முகப்பு" : "Home"}
          </Link>
          <Link to="/cart" onClick={() => setOpen(false)}>
            {lang === "ta" ? "கார்ட்" : "Cart"}
          </Link>
          <Link to="/orders" onClick={() => setOpen(false)}>
            {lang === "ta" ? "ஆர்டர்கள்" : "Orders"}
          </Link>
          {!userInfo && (
            <Link to="/register" onClick={() => setOpen(false)}>
              {lang === "ta" ? "பதிவு செய்" : "Register"}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}