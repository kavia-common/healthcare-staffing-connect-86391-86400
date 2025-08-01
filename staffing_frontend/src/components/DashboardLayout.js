import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { role } = useAuth();
  const location = useLocation();

  const menu = [
    { to: "/jobs", label: "Browse Jobs", show: true },
    { to: "/applications", label: "My Applications", show: role !== "org" && role !== "org_admin" },
    { to: "/schedule", label: "My Schedule", show: role !== "org" && role !== "org_admin" },
    { to: "/jobs/new", label: "Post a Job", show: role === "org_admin" || role === "org" },
    { to: "/org", label: "Organization Dashboard", show: role === "org_admin" || role === "org" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 50px)" }}>
      <aside className="dashboard-menu">
        <nav>
          {menu.filter(item => item.show).map(item => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: "block",
                padding: "1rem",
                color: location.pathname === item.to ? "var(--color-accent)" : "var(--color-primary)",
                fontWeight: location.pathname === item.to ? 700 : 500,
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "2rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
export default DashboardLayout;
