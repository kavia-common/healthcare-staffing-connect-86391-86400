import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

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
