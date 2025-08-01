import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function Schedule() {
  const { token } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedule() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/user/schedule`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setSchedule(data);
      } catch (_e) {
        setSchedule([]);
      }
      setLoading(false);
    }
    fetchSchedule();
  }, [token]);

  return (
    <div>
      <h2>My Schedule</h2>
      {loading && "Loading..."}
      {schedule.length === 0 && !loading && <div>No upcoming shifts.</div>}
      {schedule.map(shift => (
        <div className="card" key={shift.id} style={{ marginBottom: 16 }}>
          <h4 style={{ color: "var(--color-primary)" }}>{shift.job_title}</h4>
          <div>Date: <b>{shift.date}</b> | {shift.shift_start} - {shift.shift_end}</div>
          <div>Location: {shift.location}</div>
          <div>Status: <b>{shift.status}</b></div>
        </div>
      ))}
    </div>
  );
}

export default Schedule;
