import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../models/api";

export default function CompleteProfile() {
  const { refreshUser, navigateByRole, user } = useAuth();  
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    account_type: "individual",
    date_of_birth: "",
    national_id_number: "",
    address: "",
    company_name: "",
    position: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.first_name || !form.last_name) {
      setError("First name and last name are required.");
      return;
    }

    if (form.account_type === "company" && !form.company_name) {
      setError("Company name is required for company accounts.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/complete-profile", {
        first_name: form.first_name,
        last_name: form.last_name,
        account_type: form.account_type,
        date_of_birth: form.date_of_birth || null,
        national_id_number: form.national_id_number || null,
        address: form.address || null,
        company_name: form.account_type === "company" ? form.company_name : null,
        position: form.account_type === "company" ? form.position : null,
      });

      await refreshUser();
      navigateByRole(user.role_id);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <img src="/logo.jpeg" alt="Kora Fleet" style={s.logo} />
        <h2 style={s.title}>Complete your profile</h2>
        <p style={s.sub}>Tell us about yourself before you get started.</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.row}>
            <div style={s.field}>
              <label style={s.label}>First name</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                style={s.input}
                required
                placeholder="John"
              />
            </div>
            <div style={s.field}>
              <label style={s.label}>Last name</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                style={s.input}
                required
                placeholder="Doe"
              />
            </div>
          </div>

          <label style={s.label}>Account type</label>
          <select name="account_type" value={form.account_type} onChange={handleChange} style={s.input}>
            <option value="individual">Individual</option>
            <option value="company">Company</option>
          </select>

          <label style={s.label}>Date of birth</label>
          <input
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={handleChange}
            style={s.input}
          />

          <label style={s.label}>National ID number</label>
          <input
            name="national_id_number"
            value={form.national_id_number}
            onChange={handleChange}
            style={s.input}
            placeholder="e.g. 1199012345678901"
          />

          <label style={s.label}>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            style={s.input}
            placeholder="e.g. KG 123 St, Kigali"
          />

          {form.account_type === "company" && (
            <>
              <label style={s.label}>Company name</label>
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                style={s.input}
                required
                placeholder="e.g. Kigali Logistics Ltd"
              />
              <label style={s.label}>Your position</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                style={s.input}
                placeholder="e.g. Fleet Manager"
              />
            </>
          )}

          {error && <p style={s.error}>{error}</p>}

          <button type="submit" style={s.btn} disabled={loading}>
            {loading ? "Saving..." : "Save and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f4f4f4", fontFamily: "sans-serif" },
  card: { backgroundColor: "#fff", padding: "40px", width: "460px", border: "1px solid #ccc" },
  logo: { width: "60px", height: "60px", objectFit: "contain", marginBottom: "16px" },
  title: { margin: "0 0 8px 0", fontSize: "20px", color: "#0f172a" },
  sub: { margin: "0 0 24px 0", fontSize: "13px", color: "#64748b", lineHeight: "1.5" },
  form: { display: "flex", flexDirection: "column" },
  row: { display: "flex", gap: "12px" },
  field: { display: "flex", flexDirection: "column", flex: 1 },
  label: { fontSize: "12px", fontWeight: "600", color: "#0f172a", marginBottom: "6px", marginTop: "14px" },
  input: { padding: "10px", border: "1px solid #ccc", fontSize: "14px", outline: "none", backgroundColor: "#fff" },
  error: { color: "#dc2626", fontSize: "13px", marginTop: "12px" },
  btn: { padding: "11px", backgroundColor: "#0f172a", color: "#fff", border: "none", fontSize: "15px", cursor: "pointer", fontWeight: "600", marginTop: "20px" },
};