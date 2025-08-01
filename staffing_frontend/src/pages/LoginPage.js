import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_EMAIL = "demo@demo.com";
const DEMO_PASSWORD = "DemoPass123!";

// PUBLIC_INTERFACE
function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  // Add helper to quickly fill demo account fields
  const autoFillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const res = await login(email, password);
    if (res?.success) {
      navigate("/");
    } else {
      setErr(res?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 350, margin: "2rem auto" }}>
      <h2 style={{ color: "var(--color-primary)" }}>Sign in</h2>
      <div
        style={{
          background: "#fffae6",
          border: "1.5px solid #ffe082",
          color: "#ce8700",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "15px"
        }}
      >
        <b>Demo User:</b>&nbsp; QA testers can log in with:<br />
        <span style={{ fontFamily: "monospace" }}>
          Email: {DEMO_EMAIL}<br />
          Password: {DEMO_PASSWORD}
        </span>
        <div style={{ marginTop: 7 }}>
          <button
            type="button"
            className="btn"
            style={{
              marginTop: 8,
              fontSize: 13,
              background: "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "3px 12px"
            }}
            onClick={autoFillDemo}
          >
            Autofill Demo Credentials
          </button>
        </div>
        <div style={{ fontSize: "13px", marginTop: 5, color: "#665000" }}>
          If the demo user isn't registered yet, click <b>Register</b> and submit the pre-filled form.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
        <label>Password</label>
        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn" type="submit" disabled={loading} style={{ marginTop: 20, width: "100%" }}>
          {loading ? "Signing in..." : "Login"}
        </button>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
      </form>
      <div style={{ marginTop: 14, fontSize: 14 }}>
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
export default LoginPage;
