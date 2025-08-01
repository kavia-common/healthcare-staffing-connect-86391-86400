import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function JobBoard() {
  const { token, role } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/jobs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Could not fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (e) {
        setErr("Error fetching jobs");
      }
      setLoading(false);
    }
    fetchJobs();
  }, [token]);

  useEffect(() => {
    if (role === "clinician") {
      async function fetchMyApplications() {
        try {
          const res = await fetch(`${process.env.REACT_APP_API_URL}/applications/my`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setAppliedJobs(data.map(a => a.job_id));
          }
        } catch (_e) {}
      }
      fetchMyApplications();
    }
  }, [token, role]);

  const applyForJob = async (job_id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${job_id}/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      setAppliedJobs(jobs => ([...jobs, job_id]));
      alert("Application submitted!");
    } catch (_e) {
      alert("Could not apply for this job.");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
        <h2 style={{ flex: 1 }}>Job Opportunities</h2>
        {(role === "org" || role === "org_admin") && (
          <Link to="/jobs/new">
            <button className="btn" style={{ background: "var(--color-secondary)" }}>Post New Job</button>
          </Link>
        )}
      </div>
      {loading && "Loading..."}
      {err && <div style={{ color: "red" }}>{err}</div>}
      {jobs.length === 0 && !loading && <div style={{ color: "#888" }}>No jobs posted.</div>}
      {jobs.map(job => (
        <div className="card" key={job.id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ color: "var(--color-primary)", marginBottom: 6 }}>{job.title}</h3>
              <div style={{ fontSize: "1.02rem" }}>{job.org_name || job.organization}</div>
              <div style={{ margin: "9px 0" }}>{job.description}</div>
              <div>Shift: <strong>{job.date}</strong> ({job.shift_start} - {job.shift_end})</div>
              <div>Location: {job.location}</div>
            </div>
            {role === "clinician" && (
              <div style={{ textAlign: "right" }}>
                <button
                  className="btn"
                  style={{ background: "var(--color-accent)", opacity: appliedJobs.includes(job.id) ? 0.5 : 1, marginTop: 6 }}
                  disabled={appliedJobs.includes(job.id)}
                  onClick={() => applyForJob(job.id)}
                >
                  {appliedJobs.includes(job.id) ? "Applied" : "Apply for Shift"}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobBoard;
