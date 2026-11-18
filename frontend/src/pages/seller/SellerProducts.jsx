import { useEffect, useState, useRef } from "react";
import { Pencil, Trash2, Plus, X, Upload, Link as LinkIcon, Image as ImageIcon, Sparkles } from "lucide-react";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";

const emptyForm = {
  name: "",
  price: "",
  mrp: "",
  description: "",
  image: "",
  brand: "",
  category: "Accessories",
  countInStock: "",
};

const CATEGORIES = ["Accessories", "Electronics", "Fashion", "Footwear", "Home & Kitchen"];

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState("gallery"); // 'gallery' | 'url'
  const fileInputRef = useRef(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/seller/products");
      setProducts(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageMode("gallery");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      mrp: product.mrp || "",
      description: product.description,
      image: product.image,
      brand: product.brand,
      category: product.category,
      countInStock: product.countInStock,
    });
    setEditingId(product._id);
    setImageMode(product.image?.startsWith("http") ? "url" : "gallery");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fast image compression via canvas for crisp quality and instant load
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.84);
        setForm((prev) => ({ ...prev, image: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      setError("Please provide a product image via gallery upload or URL");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mrp: form.mrp ? Number(form.mrp) : 0,
        countInStock: Number(form.countInStock),
      };

      if (editingId) {
        await api.put(`/seller/products/${editingId}`, payload);
      } else {
        await api.post("/seller/products", payload);
      }

      closeForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/seller/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete product");
    }
  };

  return (
    <div className="seller-products-container">
      <div className="seller-section-header">
        <div>
          <h2>My Products ({products.length})</h2>
          <p className="hint">Manage atelier inventory, stock availability, and catalog listings.</p>
        </div>
        {!showForm && (
          <button className="btn-pill" onClick={openAddForm}>
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {error && <p className="error" style={{ marginBottom: "16px" }}>{error}</p>}

      {showForm && (
        <form className="seller-product-form" onSubmit={handleSubmit}>
          <div className="form-header-row">
            <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
            <button type="button" className="icon-btn" onClick={closeForm}>
              <X size={18} />
            </button>
          </div>

          <div className="form-grid">
            <div>
              <label>Product Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Royal Tourbillon Timepiece" required />
            </div>
            <div>
              <label>Brand / Atelier</label>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Norra Atelier" required />
            </div>
            <div>
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 14999"
                min="0"
                required
              />
            </div>
            <div>
              <label>MRP (₹) — optional strikethrough</label>
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                placeholder="e.g. 19999"
                min="0"
              />
            </div>
            <div>
              <label>Stock Quantity</label>
              <input
                type="number"
                name="countInStock"
                value={form.countInStock}
                onChange={handleChange}
                placeholder="e.g. 10"
                min="0"
                required
              />
            </div>
          </div>

          {/* Image Upload / URL Selector */}
          <div className="image-field-block">
            <div className="image-field-header">
              <label>Product Imagery</label>
              <div className="image-mode-toggles">
                <button
                  type="button"
                  className={`image-tab-pill ${imageMode === "gallery" ? "active" : ""}`}
                  onClick={() => setImageMode("gallery")}
                >
                  <Upload size={14} /> Local Gallery / Files
                </button>
                <button
                  type="button"
                  className={`image-tab-pill ${imageMode === "url" ? "active" : ""}`}
                  onClick={() => setImageMode("url")}
                >
                  <LinkIcon size={14} /> Image URL
                </button>
              </div>
            </div>

            {imageMode === "gallery" ? (
              <div
                className="gallery-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageFile}
                />
                <div className="dropzone-content">
                  <ImageIcon size={28} className="dropzone-icon" />
                  <div>
                    <strong style={{ display: "block", color: "var(--text)" }}>
                      Choose Photo from Gallery / Device
                    </strong>
                    <span className="hint" style={{ fontSize: "0.82rem" }}>
                      Tap to browse files. Supports PNG, JPEG, WEBP.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="url-input-wrap">
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Paste direct image link: https://images.unsplash.com/..."
                />
              </div>
            )}

            {/* Live Image Preview */}
            {form.image && (
              <div className="product-image-preview-card">
                <img
                  src={form.image}
                  alt="Product Preview"
                  className="preview-img-tag"
                  onError={(e) => (e.target.style.opacity = "0.3")}
                />
                <div className="preview-details">
                  <span className="preview-status-pill">
                    <Sparkles size={12} /> Image Ready
                  </span>
                  <button
                    type="button"
                    className="clear-image-button"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                  >
                    <X size={14} /> Remove / Change
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "14px" }}>
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe materials, origin, sizing, and bespoke features..."
              rows={3}
              required
            />
          </div>

          <div className="form-submit-row">
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Product" : "Publish to Atelier"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>You haven't listed any products yet. Click "Add Product" to get started.</p>
      ) : (
        <div className="responsive-table-wrapper">
          <table className="orders-table seller-products-table">
            <thead>
              <tr>
                <th style={{ width: "64px" }}>Photo</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{ textAlign: "center", width: "170px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image || "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80"}
                      alt={p.name}
                      className="table-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                    {p.brand && <span className="table-sub-brand">{p.brand}</span>}
                  </td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    <span className={p.countInStock === 0 ? "off-tag" : "stock-pill"}>
                      {p.countInStock === 0 ? "Out of stock" : `${p.countInStock} in stock`}
                    </span>
                  </td>
                  <td className="table-actions-cell">
                    <div className="table-actions-group">
                      <button
                        className="action-btn edit-action-btn"
                        onClick={() => openEditForm(p)}
                        title="Edit Product"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        className="action-btn delete-action-btn"
                        onClick={() => handleDelete(p._id)}
                        title="Delete Product"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
