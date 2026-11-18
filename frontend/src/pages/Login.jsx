import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="auth-page">
      <div className="container form-container">
        <div className="form-header">
          <div className="form-brand-pill">
            <Sparkles size={14} className="text-gold" />
            <span>NORRA PRIVÉ</span>
          </div>
          <h1>Welcome Back</h1>
          <p className="form-subtitle">
            Sign in to access your curated orders, saved pieces, and bespoke atelier services.
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={submitHandler} className="premium-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In to Norra"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="form-footer">
          <p>
            New to Norra?{" "}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
              className="accent-link"
            >
              Create an Account
            </Link>
          </p>

          <div className="demo-credentials-box">
            <span className="demo-label">Quick Demo Access:</span>
            <div className="demo-chips">
              <button
                type="button"
                className="demo-chip"
                onClick={() => handleQuickLogin("admin@example.com", "123456")}
              >
                Admin
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => handleQuickLogin("john@example.com", "123456")}
              >
                Customer
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => handleQuickLogin("seller1@example.com", "123456")}
              >
                Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
