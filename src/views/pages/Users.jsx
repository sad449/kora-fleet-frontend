import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, getRoles, createUser, deleteUser } from "../../models/userModel";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    role_id: "",
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Failed to load users.");
    }
  }

  async function loadRoles() {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch {
      setError("Failed to load roles.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createUser({
        email: form.email,
        password: form.password,
        role_id: parseInt(form.role_id),
      });
      setSuccess(`User ${form.email} created. They can now log in with the temporary password.`);
      setShowForm(false);
      setForm({ email: "", password: "", role_id: "" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create user.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Deactivate this user? They will no longer be able to log in.")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch {
      setError("Failed to deactivate user.");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <button onClick={() => navigate("/dashboard")} style={s.backBtn}>
            ← Dashboard
          </button>
          <h2 style={s.title}>Users</h2>
        </div>
        <button style={s.addBtn} onClick={() => { setShowForm(!showForm); setError(""); setSuccess(""); }}>
          {showForm ? "Cancel" : "+ Add user"}
        </button>
      </div>

      {success && <p style={s.success}>{success}</p>}
      {error && <p style={s.error}>{error}</p>}

      {showForm && (
        <div style={s.formWrap}>
          <h3 style={s.formTitle}>Create new user</h3>
          <p style={s.formNote}>
            Enter the user's email and a temporary password. They will be prompted to change their password and complete their profile when they first log in.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={s.row}>
              <div style={s.field}>
                <label style={s.label}>Email address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  style={s.input}
                  required
                  placeholder="user@example.com"
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Temporary password</label>
                <input
                  name="password"
                  type="text"
                  value={form.password}
                  onChange={handleChange}
                  style={s.input}
                  required
                  placeholder="e.g. Kora2026!"
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Role</label>
                <select
                  name="role_id"
                  value={form.role_id}
                  onChange={handleChange}
                  style={s.input}
                  required
                >
                  <option value="">Select role</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" style={s.submitBtn}>Create user</button>
          </form>
        </div>
      )}

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={s.th}>Name</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Role</th>
              <th style={s.th}>Account type</th>
              <th style={s.th}>Profile</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ ...s.td, color: "#94a3b8", textAlign: "center", padding: "32px" }}>
                  No users yet. Click + Add user to create one.
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={u.id} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                  <td style={s.td}>
                    {u.first_name || u.last_name
                      ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
                      : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Not set yet</span>
                    }
                  </td>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}>{u.role_id}</td>
                  <td style={s.td}>{u.account_type}</td>
                  <td style={s.td}>
                    {u.profile_completed
                      ? <span style={s.badgeGreen}>Complete</span>
                      : <span style={s.badgeGrey}>Pending</span>
                    }
                  </td>
                  <td style={s.td}>
                    {u.is_active
                      ? <span style={s.badgeGreen}>Active</span>
                      : <span style={s.badgeRed}>Inactive</span>
                    }
                  </td>
                  <td style={s.td}>
                    {u.role_id !== 1 && (
                      <button onClick={() => handleDelete(u.id)} style={s.deleteBtn}>
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const s = {
  page: {
    padding: "0",
    fontFamily: "sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 32px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
  },
  topLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  backBtn: {
    padding: "7px 14px",
    backgroundColor: "transparent",
    color: "#475569",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    fontSize: "13px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    color: "#0f172a",
  },
  addBtn: {
    padding: "9px 20px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px 32px",
    margin: 0,
    fontSize: "13px",
    borderBottom: "1px solid #bbf7d0",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px 32px",
    margin: 0,
    fontSize: "13px",
    borderBottom: "1px solid #fecaca",
  },
  formWrap: {
    margin: "24px 32px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "24px",
  },
  formTitle: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    color: "#0f172a",
  },
  formNote: {
    margin: "0 0 20px 0",
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.6",
  },
  row: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "6px",
  },
  input: {
    padding: "9px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#ffffff",
  },
  submitBtn: {
    padding: "10px 24px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  tableWrap: {
    margin: "24px 32px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
  },
  th: {
    textAlign: "left",
    padding: "11px 14px",
    borderBottom: "2px solid #e2e8f0",
    fontSize: "12px",
    color: "#475569",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "11px 14px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#334155",
  },
  badgeGreen: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: "600",
  },
  badgeGrey: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: "600",
  },
  badgeRed: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: "600",
  },
  deleteBtn: {
    padding: "5px 12px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
  },
};