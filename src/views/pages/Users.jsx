import { useEffect, useState } from "react";
import { getUsers, getRoles, createUser, deleteUser } from "../../models/userModel";
import Layout from "../../components/Layout";
import "../../styles/Users.css";

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
      <div className="users-header">
        <h2 className="users-title">{showForm ? "Add new user" : "Users"}</h2>
        <button
          type="button"
          className={showForm ? "users-cancel-btn" : "users-add-btn"}
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? "← Back to users" : "+ Add user"}
        </button>
      </div>

      {success && <p className="users-success">{success}</p>}
      {error && <p className="users-error">{error}</p>}

      {showForm ? (
        <div className="users-form-wrap">
          <p className="users-form-note">
            Set the email and a temporary password. The user will set their own
            password and complete their profile on first login.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="users-row">
              <div className="users-field">
                <label className="users-label">Email address</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="users-input"
                  required
                  placeholder="user@example.com"
                />
              </div>
              <div className="users-field">
                <label className="users-label">Temporary password</label>
                <input
                  name="password"
                  type="text"
                  value={form.password}
                  onChange={handleChange}
                  className="users-input"
                  required
                  placeholder="e.g. Kora2026!"
                />
              </div>
              <div className="users-field">
                <label className="users-label">Role</label>
                <select
                  name="role_id"
                  value={form.role_id}
                  onChange={handleChange}
                  className="users-input"
                  required
                >
                  <option value="">Select role</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="users-submit-btn">
              Create user
            </button>
          </form>
        </div>
      ) : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th className="users-th">Name</th>
                <th className="users-th">Email</th>
                <th className="users-th">Role</th>
                <th className="users-th">Profile</th>
                <th className="users-th">Status</th>
                <th className="users-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="users-td-empty">
                    No users yet. Click + Add user to create one.
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}
                  >
                    <td className="users-td">
                      {u.first_name || u.last_name
                        ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
                        : <span className="users-not-set">Not set yet</span>
                      }
                    </td>
                    <td className="users-td">{u.email}</td>
                    <td className="users-td">{u.role_id}</td>
                    <td className="users-td">
                      {u.profile_completed
                        ? <span className="badge-green">Complete</span>
                        : <span className="badge-grey">Pending</span>
                      }
                    </td>
                    <td className="users-td">
                      {u.is_active
                        ? <span className="badge-green">Active</span>
                        : <span className="badge-red">Inactive</span>
                      }
                    </td>
                    <td className="users-td">
                      {u.role_id !== 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeactivate(u.id)}
                          className="users-deactivate-btn"
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