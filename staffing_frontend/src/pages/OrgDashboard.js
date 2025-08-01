import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function OrgDashboard() {
  const { token } = useAuth();
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchPostings() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/org/postings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Could not fetch job postings");
        const data = await res.json();
        setPostings(data);
      } catch (_e) {
        setErr("Error loading postings");
      }
      setLoading(false);
    }
    fetchPostings();
  }, [token]);

  const deleteJob = async (jobId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setPostings(list => list.filter(j => j.id !== jobId));
      setSelectedJobId(null);
    } catch (_e) {}
  };

  const loadCandidates = async (jobId) => {
    setSelectedJobId(jobId);
    setCandidates([]);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setCandidates(data);
    } catch (_e) {
      setCandidates([]);
    }
  };

  const handleAccept = async (applicationId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/applications/${applicationId}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates((cands) =>
        cands.map(c => c.id === applicationId ? { ...c, status: "accepted" } : c)
      );
    } catch (_e) {}
  };

  return (
    <div>
      <h2>Organization Dashboard</h2>
      {loading && "Loading..."}
      {err && <div style={{ color: "red" }}>{err}</div>}
      <div>
        <h3>My Job Postings</h3>
        {postings.length === 0 && !loading && <div>No postings yet.</div>}
        {postings.map(job => (
          <div className="card" key={job.id}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h4 style={{ color: "var(--color-primary)" }}>{job.title}</h4>
                <div>Date: {job.date}</div>
              </div>
              <div>
                <button className="btn" style={{ background: "var(--color-accent)", marginRight: 8 }} onClick={() => deleteJob(job.id)}>
                  Delete
                </button>
                <button className="btn" onClick={() => loadCandidates(job.id)}>
                  View Applicants
                </button>
              </div>
            </div>
            {selectedJobId === job.id && (
              <div style={{ marginTop: 14 }}>
                <b>Applicants:</b>
                {candidates.length === 0 && <div style={{ fontSize: 14 }}>No applicants.</div>}
                {candidates.map(app => (
                  <div key={app.id} style={{ marginTop: 5, padding: 9, border: "1px solid #eee", borderRadius: 5 }}>
                    <b>{app.candidate_name}</b> - {app.status}
                    {app.status !== "accepted" && (
                      <button className="btn" style={{ marginLeft: 12, background: "var(--color-secondary)" }} onClick={() => handleAccept(app.id)}>
                        Accept
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrgDashboard;
