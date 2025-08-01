import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// DEMO USER CONSTANTS
const DEMO_EMAIL = "demo@demo.com";
const DEMO_PASSWORD = "DemoPass123!";

/**
 * PUBLIC_INTERFACE
 * Registration form with pre-filled demo user info and note for testers.
 */
function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("clinician");

  // Pre-fill demo user values initially
  const [name, setName] = useState("Demo User");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // If user switches to org registration, clear personal name
  useEffect(() => {
    if (role === "clinician") {
      setName("Demo User");
    } else {
      setOrgName("Demo Organization");
    }
    // Always pre-fill demo credentials in their respective fields
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }, [role]);

  const handleSubmit = async e => {
    e.preventDefault();
    setErr(""); setMsg("");
    const payload = { email, password, role, name: role === "clinician" ? name : orgName };
    const res = await register(payload);
    if (res?.success) {
      setMsg("Registration successful! You may now log in.");
      setTimeout(() => navigate("/login"), 1200);
    } else {
      setErr(res?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 380, margin: "2rem auto" }}>
      <h2 style={{ color: "var(--color-secondary)" }}>Register</h2>
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
        <b>Demo User:</b>&nbsp; To test login or registration, use the credentials below:<br />
        <span style={{ fontFamily: "monospace" }}>
          Email: {DEMO_EMAIL}<br />
          Password: {DEMO_PASSWORD}
        </span>
        <div style={{ fontSize: "13px", marginTop: 5, color: "#665000" }}>
          Registering with these credentials will create a fresh demo user.<br/>
          <b>Tip:</b> You can simply click "Register" to create the <i>demo@demo.com</i> test account.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <label>
          <input type="radio" name="role" value="clinician" checked={role === "clinician"} onChange={() => setRole("clinician")} />
          Clinician
        </label>{" "}
        <label style={{ marginLeft: 14 }}>
          <input type="radio" name="role" value="org" checked={role === "org"} onChange={() => setRole("org")} />
          Organization
        </label>
        {role === "clinician" ? (
          <>
            <label>Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} />
          </>
        ) : (
          <>
            <label>Organization Name</label>
            <input required value={orgName} onChange={e => setOrgName(e.target.value)} />
          </>
        )}
        <label>Email</label>
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} />
        <button className="btn" type="submit" disabled={loading} style={{ marginTop: 20, width: "100%" }}>
          {loading ? "Registering..." : "Register"}
        </button>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        {msg && <div style={{ color: "green", marginTop: 8 }}>{msg}</div>}
      </form>
    </div>
  );
}
export default RegisterPage;
