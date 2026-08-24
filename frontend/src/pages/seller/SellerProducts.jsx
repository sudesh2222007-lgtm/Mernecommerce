import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import api from "../../api/axios";
import { formatPrice } from "../../utils/format";

const emptyForm = {
  name: "",
  price: "",
  mrp: "",
  description: "",
  image: "",
  brand: "",
  category: "Electronics",
  countInStock: "",
};

const CATEGORIES = ["Electronics", "Footwear", "Fashion", "Accessories", "Home & Kitchen"];

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div>
      <div className="seller-section-header">
        <h2>My Products ({products.length})</h2>
        {!showForm && (
          <button className="btn-pill" onClick={openAddForm}>
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {error && <p className="error">{error}</p>}

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
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label>Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} required />
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
              <label>Image URL</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>
            <div>
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div>
              <label>MRP (₹) — optional, for a strikethrough discount</label>
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
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
                min="0"
                required
              />
            </div>
          </div>

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>You haven't listed any products yet. Click "Add Product" to get started.</p>
      ) : (
        <table className="orders-table seller-products-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img src={p.image} alt={p.name} className="table-thumb" onError={(e) => (e.target.style.visibility = "hidden")} />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{formatPrice(p.price)}</td>
                <td>
                  <span className={p.countInStock === 0 ? "off-tag" : ""}>
                    {p.countInStock === 0 ? "Out of stock" : p.countInStock}
                  </span>
                </td>
                <td className="table-actions">
                  <button className="icon-btn" onClick={() => openEditForm(p)} title="Edit">
                    <Pencil size={16} />
                  </button>
                  <button className="icon-btn" onClick={() => handleDelete(p._id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerProducts;
