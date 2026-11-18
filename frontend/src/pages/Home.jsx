import { useEffect, useState, useRef, useCallback } from "react";
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

// Memory cache for instantaneous client-side navigation
const memoryCache = new Map();

const getCache = (key) => {
  if (memoryCache.has(key)) return memoryCache.get(key);
  try {
    const raw = sessionStorage.getItem(`norra_c_${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      memoryCache.set(key, parsed);
      return parsed;
    }
  } catch (e) {}
  return null;
};

const setCache = (key, data) => {
  memoryCache.set(key, data);
  try {
    sessionStorage.setItem(`norra_c_${key}`, JSON.stringify(data));
  } catch (e) {}
};

// Shimmering luxury skeleton card for 0-delay perception
const ProductSkeleton = () => (
  <div className="product-card skeleton-card">
    <div className="skeleton-media shimmer"></div>
    <div className="product-card-body">
      <div className="skeleton-line skeleton-meta shimmer"></div>
      <div className="skeleton-line skeleton-title shimmer"></div>
      <div className="skeleton-line skeleton-title-sub shimmer"></div>
      <div className="skeleton-line skeleton-price shimmer"></div>
    </div>
  </div>
);

const Home = () => {
  // Initialize with cached products immediately on first render if available
  const [products, setProducts] = useState(() => {
    const initial = getCache("All");
    return initial?.products || [];
  });
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(() => {
    const initial = getCache("All");
    return !(initial?.products && initial.products.length > 0);
  });
  const [error, setError] = useState("");
  
  const searchTimeoutRef = useRef(null);

  const fetchProducts = useCallback(async (search = "", category = "All") => {
    const cacheKey = `${category}_${search.trim().toLowerCase()}`;
    const cached = getCache(cacheKey);

    // If cached, render immediately without showing a blank screen
    if (cached?.products?.length) {
      setProducts(cached.products);
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      const categoryParam =
        category !== "All"
          ? `&category=${encodeURIComponent(category)}`
          : "";
      const searchParam = search ? `keyword=${encodeURIComponent(search)}` : "";
      const queryParams = [searchParam, categoryParam].filter(Boolean).join("&");
      const url = queryParams ? `/products?${queryParams}` : "/products";

      const { data } = await api.get(url);
      const fetchedProducts = data.products || [];
      
      setProducts(fetchedProducts);
      setCache(cacheKey, { products: fetchedProducts });
      setError("");
    } catch (err) {
      if (!cached) {
        setError(err.response?.data?.message || "Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(keyword, activeCategory);
  }, [fetchProducts, activeCategory]);

  const handleSearchChange = (val) => {
    setKeyword(val);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(val, activeCategory);
    }, 200);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    fetchProducts(keyword, activeCategory);
  };

  const handleCategory = (category) => {
    if (category === activeCategory) return;
    setActiveCategory(category);
    // Instant switch to cached category if present
    const cached = getCache(`${category}_${keyword.trim().toLowerCase()}`);
    if (cached?.products?.length) {
      setProducts(cached.products);
      setLoading(false);
    } else {
      setLoading(true);
    }
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
          <span className="section-count">
            {loading && products.length === 0 ? "..." : `${products.length} ${products.length === 1 ? "piece" : "pieces"}`}
          </span>
        </div>

        {error && <p className="error">{error}</p>}

        {/* 2 Products Per Row Luxury Grid with Shimmer Skeletons */}
        <div className="product-grid">
          {loading && products.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={`skeleton-${i}`} />
              ))
            : products.map((product, idx) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  priority={idx < 4}
                />
              ))}
        </div>

        {!loading && products.length === 0 && !error && (
          <div className="empty-catalog">
            <p className="muted">No products matched your search. Explore other categories.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
