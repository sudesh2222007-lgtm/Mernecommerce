import { useEffect, useState, useRef } from "react";
import { Search, Sparkles } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  "All",
  "Electronics",
  "Footwear",
  "Fashion",
  "Accessories",
  "Home & Kitchen",
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const searchTimeoutRef = useRef(null);

  const fetchProducts = async (search = "", category = "All") => {
    try {
      if (products.length === 0) setLoading(true);
      const categoryParam =
        category !== "All"
          ? `&category=${encodeURIComponent(category)}`
          : "";
      const { data } = await api.get(
        `/products?keyword=${encodeURIComponent(search)}${categoryParam}`
      );
      setProducts(data.products || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (val) => {
    setKeyword(val);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(val, activeCategory);
    }, 250);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    fetchProducts(keyword, activeCategory);
  };

  const handleCategory = (category) => {
    setActiveCategory(category);
    fetchProducts(keyword, category);
  };

  return (
    <div className="home-page">
      {/* Luxury Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={12} className="text-gold" />
            <span>NORRA ATELIER • SPRING 2026</span>
          </div>
          <h1 className="hero-title">Curated Elegance for Modern Living</h1>
          <p className="hero-subtitle">
            Explore handcrafted fashion, high-fidelity tech, and iconic essentials defined by timeless craft.
          </p>

          <form onSubmit={handleSearchSubmit} className="hero-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by brand, category, or luxury piece..."
              value={keyword}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search products"
            />
          </form>
        </div>
      </section>

      <div className="container">
        {/* Category Filter Pills */}
        <div className="category-section">
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pill ${activeCategory === cat ? "pill-active" : ""}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">COLLECTION</span>
            <h2>{activeCategory === "All" ? "Featured Creations" : activeCategory}</h2>
          </div>
          <span className="section-count">{products.length} {products.length === 1 ? "piece" : "pieces"}</span>
        </div>

        {loading && products.length === 0 && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="muted">Curating collection...</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {/* 2 Products Per Row Grid */}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {!loading && products.length === 0 && (
          <div className="empty-catalog">
            <p className="muted">No products matched your search. Explore other categories.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
