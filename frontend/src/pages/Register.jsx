import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, ArrowRight, Store } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (isSeller && !storeName.trim()) {
      setError("Please provide a boutique or studio name to register as a seller");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(name, email, password, isSeller, storeName);
      navigate(isSeller ? "/seller" : redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container form-container">
        <div className="form-header">
          <div className="form-brand-pill">
            <Sparkles size={14} className="text-gold" />
            <span>JOIN NORRA</span>
          </div>
          <h1>Create Your Profile</h1>
          <p className="form-subtitle">
            Become a member to experience tailored recommendations, priority shipping, and bespoke collections.
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={submitHandler} className="premium-form">
          <div className="form-group">
            <label htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <input
              id="reg-confirm"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="seller-toggle-card">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isSeller}
                onChange={(e) => setIsSeller(e.target.checked)}
              />
              <span className="checkbox-text">
                <Store size={16} className="text-gold" />
                <span>Register as an Atelier / Seller (List & Sell Your Own Creations)</span>
              </span>
            </label>

            {isSeller && (
              <div className="form-group seller-name-field">
                <label htmlFor="reg-store">Atelier / Boutique Name</label>
                <input
                  id="reg-store"
                  type="text"
                  placeholder="e.g. Luminary Craft Studio"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required={isSeller}
                />
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Profile..." : isSeller ? "Open Seller Studio" : "Create Norra Account"}{" "}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="form-footer">
          <p>
            Already a member?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="accent-link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
