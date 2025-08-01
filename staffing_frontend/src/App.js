import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./styles/global.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import DashboardLayout from "./components/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobBoard from "./pages/JobBoard";
import JobPostForm from "./pages/JobPostForm";
import MyApplications from "./pages/MyApplications";
import Schedule from "./pages/Schedule";
import OrgDashboard from "./pages/OrgDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<JobBoard />} />
            <Route path="jobs" element={<JobBoard />} />
            <Route path="jobs/new" element={<JobPostForm />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="org" element={<OrgDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
