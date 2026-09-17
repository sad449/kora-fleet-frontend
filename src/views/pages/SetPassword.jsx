import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../models/api";

export default function SetPassword() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ old_password: "", new_password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.new_password !== form.confirm) {
      setError("New passwords do not match.");
      return;
    }

    if (form.new_password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        old_password: form.old_password,
        new_password: form.new_password,
      });

      const updated = await refreshUser();

      if (!updated.profile_completed) {
        navigate("/complete-profile");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>Set your password</h2>
        <p style={s.sub}>You are logging in for the first time. Please set a new password before continuing.</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Current password</label>
          <input
            type="password"
            value={form.old_password}
            onChange={e => setForm({ ...form, old_password: e.target.value })}
            style={s.input}
            required
          />

          <label style={s.label}>New password</label>
          <input
            type="password"
            value={form.new_password}
            onChange={e => setForm({ ...form, new_password: e.target.value })}
            style={s.input}
            required
          />

          <label style={s.label}>Confirm new password</label>
          <input
            type="password"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            style={s.input}
            required
          />

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Saving..." : "Set password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f4f4f4", fontFamily: "sans-serif" },
  card: { backgroundColor: "#fff", padding: "40px", width: "380px", border: "1px solid #ccc" },
  title: { margin: "0 0 8px 0", fontSize: "20px", color: "#0f172a" },
  sub: { margin: "0 0 28px 0", fontSize: "13px", color: "#64748b", lineHeight: "1.5" },
  form: { display: "flex", flexDirection: "column" },
  label: { fontSize: "13px", fontWeight: "600", color: "#0f172a", marginBottom: "6px" },
  input: { padding: "10px", marginBottom: "18px", border: "1px solid #ccc", fontSize: "14px", outline: "none" },
  error: { color: "#dc2626", fontSize: "13px", marginBottom: "12px" },
  btn: { padding: "11px", backgroundColor: "#0f172a", color: "#fff", border: "none", fontSize: "15px", cursor: "pointer", fontWeight: "600" },
};