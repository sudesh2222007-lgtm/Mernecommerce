import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [error, setError] = useState("");
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
      setError("Please enter a store name to register as a seller");
      return;
    }
    try {
      await register(name, email, password, isSeller, storeName);
      navigate(isSeller ? "/seller" : redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container form-container">
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submitHandler}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isSeller}
            onChange={(e) => setIsSeller(e.target.checked)}
          />
          Register as a Seller (list and sell your own products)
        </label>

        {isSeller && (
          <>
            <label>Store Name</label>
            <input
              type="text"
              placeholder="e.g. TechNest Store"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit">
          {isSeller ? "Create Seller Account" : "Register"}
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
