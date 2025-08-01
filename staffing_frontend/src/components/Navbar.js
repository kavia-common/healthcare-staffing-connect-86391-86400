import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
function Navbar() {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "var(--color-primary)",
        color: "var(--color-white)",
        padding: "0.75rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: "bold", fontSize: 22 }}>
        <Link to="/" style={{ color: "var(--color-white)", textDecoration: "none" }}>
          Healthcare Staffing
        </Link>
      </span>
      <div>
        {user && (
          <>
            <Link to="/jobs" style={{ color: "var(--color-white)", marginRight: 16 }}>
              Jobs
            </Link>
            <Link to="/applications" style={{ color: "var(--color-white)", marginRight: 16 }}>
              My Applications
            </Link>
            <Link to="/schedule" style={{ color: "var(--color-white)", marginRight: 16 }}>
              Schedule
            </Link>
            {(role === "org_admin" || role === "org") && (
              <Link to="/org" style={{ color: "var(--color-accent)", marginRight: 16 }}>
                Org Dashboard
              </Link>
            )}
            <button
              style={{ background: "var(--color-accent)", marginLeft: 8, color: "#fff", border: "none", borderRadius: 4, padding: "0.3rem 1rem", cursor: "pointer" }}
              className="btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" style={{ color: "var(--color-accent)", marginRight: 20 }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "var(--color-white)", marginRight: 12 }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
