import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("clinician");
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

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
