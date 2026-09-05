import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
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
    <>
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">New Season Arrivals</span>
          <form onSubmit={handleSearchSubmit} className="hero-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </form>
        </div>
      </section>

      <div className="container">
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? "pill-active" : ""}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="section-heading">
          <h2>{activeCategory === "All" ? "Featured Products" : activeCategory}</h2>
          <span className="section-count">{products.length} items</span>
        </div>

        {loading && products.length === 0 && <p className="muted">Loading products...</p>}
        {error && <p className="error">{error}</p>}

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {!loading && products.length === 0 && (
          <p className="muted">No products found. Try another search.</p>
        )}
      </div>
    </>
  );
};

export default Home;
