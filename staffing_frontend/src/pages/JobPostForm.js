import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function JobPostForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    shift_start: "",
    shift_end: "",
    location: ""
  });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErr("");
    setMsg("");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Could not post job");
      setMsg("Job posted!");
      setTimeout(() => navigate("/jobs"), 900);
    } catch (_e) {
      setErr("Error posting job.");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 430, margin: "2rem auto" }}>
      <h2 style={{ color: "var(--color-secondary)" }}>Post New Job</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" required value={form.title} onChange={handleChange} />
        <label>Description</label>
        <textarea name="description" required value={form.description} onChange={handleChange} />
        <label>Date</label>
        <input name="date" type="date" required value={form.date} onChange={handleChange} />
        <label>Shift Start</label>
        <input name="shift_start" type="time" required value={form.shift_start} onChange={handleChange} />
        <label>Shift End</label>
        <input name="shift_end" type="time" required value={form.shift_end} onChange={handleChange} />
        <label>Location</label>
        <input name="location" required value={form.location} onChange={handleChange} />
        <button className="btn" type="submit" style={{ marginTop: 24, width: "100%", background: "var(--color-secondary)" }}>
          Post Job
        </button>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
        {msg && <div style={{ color: "green", marginTop: 8 }}>{msg}</div>}
      </form>
    </div>
  );
}
export default JobPostForm;
