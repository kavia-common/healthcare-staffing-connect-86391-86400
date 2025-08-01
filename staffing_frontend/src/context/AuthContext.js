import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getToken = () => localStorage.getItem("token");
const getUserRole = () => localStorage.getItem("role");

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // user = { id, name, email, role }
  const [token, setToken] = useState(getToken());
  const [role, setRole] = useState(getUserRole());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      // Optionally fetch user details with token, or decode token for user info
      setUser({ token, role });
    }
  }, [token, user, role]);

  // PUBLIC_INTERFACE
  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Try login first
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        // Login failed, try to auto-register demo user
        // Only for demo credentials (for smoother QA/testing UX)
        if (
          email === "demo@demo.com" &&
          password === "DemoPass123!"
        ) {
          // Try registration endpoint
          const regRes = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              role: "clinician",
              name: "Demo User",
            }),
          });
          if (!regRes.ok) {
            const regErr = await regRes.text();
            setLoading(false);
            return { success: false, message: `Demo not registered: ${regErr}` };
          }
          // Registration success, now try login again
          const res2 = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!res2.ok) {
            setLoading(false);
            return { success: false, message: "Login failed after registration!" };
          }
          const data = await res2.json();
          setToken(data.token);
          setRole(data.role);
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          setUser({ ...data.user, role: data.role });
          setLoading(false);
          return { success: true };
        }
        // Non-demo user: surface login error
        const txt = await res.text();
        setLoading(false);
        return { success: false, message: txt || "Login failed" };
      }
      const data = await res.json();
      setToken(data.token);
      setRole(data.role);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      setUser({ ...data.user, role: data.role });
      setLoading(false);
      return { success: true };
    } catch (e) {
      setLoading(false);
      return { success: false, message: e.message };
    }
  };

  // PUBLIC_INTERFACE
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Registration failed");
      setLoading(false);
      return { success: true };
    } catch (e) {
      setLoading(false);
      return { success: false, message: e.message };
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
