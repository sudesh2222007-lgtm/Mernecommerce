import { useEffect, useState } from "react";
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

  const fetchProducts = async (search = "", category = "All") => {
    try {
      setLoading(true);
      const categoryParam =
        category !== "All"
          ? `&category=${encodeURIComponent(category)}`
          : "";
      const { data } = await api.get(
        `/products?keyword=${encodeURIComponent(search)}${categoryParam}`
      );
      setProducts(data.products);
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

  const handleSearch = (e) => {
    e.preventDefault();
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
          <h1>
            Everyday essentials,
            <br /> made to last.
          </h1>
          <p>
            Thoughtfully sourced electronics, fashion, footwear and home
            essentials — shipped fast, backed by real reviews.
          </p>
          <form onSubmit={handleSearch} className="hero-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search for headphones, shoes, watches..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">Search</button>
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

        {loading && <p className="muted">Loading products...</p>}
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
