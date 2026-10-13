import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/threads");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-card">
      <h2>Log in to Threadbase</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          id="login-email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id="login-password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button id="login-submit-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <div className="demo-credentials">
        <p>Demo accounts (password: <code>password</code>):</p>
        <button
          type="button"
          onClick={() => {
            setEmail("ada@threadbase.dev");
            setPassword("password");
          }}
          className="demo-btn"
        >
          Use Ada (ada@threadbase.dev)
        </button>
        <button
          type="button"
          onClick={() => {
            setEmail("linus@threadbase.dev");
            setPassword("password");
          }}
          className="demo-btn"
        >
          Use Linus (linus@threadbase.dev)
        </button>
      </div>
    </div>
  );
}
