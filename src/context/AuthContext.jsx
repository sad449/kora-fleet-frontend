

import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../models/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data;

    localStorage.setItem("token", data.access_token);

    const userInfo = {
      id: data.user_id,
      full_name: data.full_name,
      role_id: data.role_id,
    };
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);

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

export function useAuth() {
  return useContext(AuthContext);
}