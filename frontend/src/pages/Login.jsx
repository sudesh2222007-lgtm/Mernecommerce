import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container form-container">
      <h1>Sign In</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={submitHandler}>
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
        <button type="submit">Sign In</button>
      </form>
      <p>
        New Customer?{" "}
        <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
          Register
        </Link>
      </p>
      <p className="hint">Demo admin: admin@example.com / 123456</p>
    </div>
  );
};

export default Login;
