// this stores who is logged in and makes that info available to the whole app
// any component can call useAuth() to get the current user or log out

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../models/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // when a  page load, this help us check if we already have a user saved in localStorage
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  async function login(email, password) {
    // Call the backend login endpoint.
    const response = await api.post("/auth/login", { email, password });
    const data = response.data;

    // save the token to local storage  so api.js can attach it to future requests
    localStorage.setItem("token", data.access_token);

    // save basic user info so we can show their name without calling /me every time
    const userInfo = {
      id: data.user_id,
      full_name: data.full_name,
      role_id: data.role_id,
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);

    // send them to the dashboard.
    navigate("/dashboard");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// shortcut hook , any component calls useAuth() instead of useContext(AuthContext)
export function useAuth() {
  return useContext(AuthContext);
}