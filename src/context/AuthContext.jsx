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

  function navigateByRole(roleId) {
    if (roleId === 1) navigate("/dashboard");
    else if (roleId === 2) navigate("/manager");
    else if (roleId === 3) navigate("/management");
    else if (roleId === 4) navigate("/driver");
    else navigate("/dashboard");
  }

  async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data;

    localStorage.setItem("token", data.access_token);

    const userInfo = {
      id: data.user_id,
      full_name: data.full_name,
      role_id: data.role_id,
      must_change_password: data.must_change_password,
      profile_completed: data.profile_completed,
    };

    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);

    if (data.must_change_password) {
      navigate("/set-password");
    } else if (!data.profile_completed) {
      navigate("/complete-profile");
    } else {
      navigateByRole(data.role_id);
    }
  }

  async function refreshUser() {
    const response = await api.get("/auth/me");
    const data = response.data;

    const userInfo = {
      id: data.id,
      full_name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.email,
      role_id: data.role_id,
      must_change_password: data.must_change_password,
      profile_completed: data.profile_completed,
    };

    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
    return userInfo;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, navigateByRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}