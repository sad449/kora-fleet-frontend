import { useEffect, useState } from "react";
import { getUsers, getRoles, createUser, deleteUser } from "../../models/userModel";
import Layout from "../../components/Layout";

export default function Users() {
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
      setSuccess(`User ${form.email} created. Share the temporary password with them.`);
      setShowForm(false);
      setForm({ email: "", password: "", role_id: "" });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create user.");
    }
  }

  async function handleDeactivate(id) {
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
    <Layout>
      <div style={s.header}>
        <h2 style={s.title}>{showForm ? "Add new user" : "Users"}</h2>
        <button
          type="button"
          style={showForm ? s.cancelBtn : s.addBtn}
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? "← Back to users" : "+ Add user"}
        </button>
      </div>

      {success && <p style={s.success}>{success}</p>}
      {error && <p style={s.error}>{error}</p>}

      {showForm ? (
        <div style={s.formWrap}>
          <p style={s.formNote}>
            Enter the email and a temporary password. The user will set their own
            password and complete their profile on first login.
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
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Role</th>
                <th style={s.th}>Type</th>
                <th style={s.th}>Profile</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ ...s.td, textAlign: "center", color: "#94a3b8", padding: "32px" }}
                  >
                    No users yet. Click + Add user to create one.
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}
                  >
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
                        <button
                          type="button"
                          onClick={() => handleDeactivate(u.id)}
                          style={s.deactivateBtn}
                        >
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
      )}
    </Layout>
  );
}

const s = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
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
  cancelBtn: {
    padding: "9px 20px",
    backgroundColor: "transparent",
    color: "#475569",
    border: "1px solid #cbd5e1",
    cursor: "pointer",
    fontSize: "14px",
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "12px 16px",
    marginBottom: "16px",
    fontSize: "13px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    marginBottom: "16px",
    fontSize: "13px",
  },
  formWrap: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    padding: "28px",
    maxWidth: "860px",
  },
  formNote: {
    margin: "0 0 24px 0",
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.6",
  },
  row: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
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
    backgroundColor: "#fff",
    color: "#0f172a",
  },
  submitBtn: {
    padding: "10px 28px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  tableWrap: {
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
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
    backgroundColor: "#f1f5f9",
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
  deactivateBtn: {
    padding: "5px 12px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "12px",
  },
};