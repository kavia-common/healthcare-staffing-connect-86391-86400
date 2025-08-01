import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function MyApplications() {
  const { token } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/applications/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Could not fetch applications");
        const data = await res.json();
        setApps(data);
      } catch (_e) {
        setErr("Error fetching applications");
      }
      setLoading(false);
    }
    fetchApplications();
  }, [token]);

  const cancelApp = async (appId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/applications/${appId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setApps(apps => apps.filter(a => a.id !== appId));
      }
    } catch (_e) {}
  };

  return (
    <div>
      <h2>My Applications</h2>
      {loading && "Loading..."}
      {err && <div style={{ color: "red" }}>{err}</div>}
      {apps.length === 0 && !loading && <div>No applications found.</div>}
      {apps.map(app => (
        <div className="card" key={app.id} style={{ marginBottom: 16 }}>
          <h3 style={{ color: "var(--color-primary)" }}>{app.job_title}</h3>
          <div>Status: <b>{app.status}</b></div>
          <div>Applied: {app.applied_at}</div>
          <button className="btn" style={{ marginTop: 10, background: "var(--color-accent)" }} onClick={() => cancelApp(app.id)}>
            Cancel Application
          </button>
        </div>
      ))}
    </div>
  );
}
export default MyApplications;
