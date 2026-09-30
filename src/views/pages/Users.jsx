import { useEffect, useState } from "react";
import { Plus, X, UserCheck } from "lucide-react";
import { getUsers, getRoles, createUser, deleteUser } from "../../models/userModel";
import Layout from "../../components/Layout";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ email: "", password: "", role_id: "" });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  async function loadUsers() {
    try { setUsers(await getUsers()); }
    catch { setError("Failed to load users."); }
  }

  async function loadRoles() {
    try { setRoles(await getRoles()); }
    catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
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
    if (!window.confirm("Deactivate this user?")) return;
    try { await deleteUser(id); loadUsers(); }
    catch { setError("Failed to deactivate user."); }
  }

  return (
    <Layout title="Users">
      {showForm ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add new user</h2>
              <p className="text-sm text-slate-500 mt-0.5">User sets their own password and profile on first login</p>
            </div>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(""); }}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X size={15} />
              Back to users
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm mb-5">
              {error}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-2xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="flex flex-col">
                  <label className="text-xs font-600 text-slate-600 mb-1.5">Email address</label>
                  <input
                    name="email" type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    required placeholder="user@example.com"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-600 text-slate-600 mb-1.5">Temporary password</label>
                  <input
                    name="password" type="text" value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                    required placeholder="e.g. Kora2026!"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-600 text-slate-600 mb-1.5">Role</label>
                  <select
                    name="role_id" value={form.role_id}
                    onChange={e => setForm({ ...form, role_id: e.target.value })}
                    className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all bg-white"
                    required
                  >
                    <option value="">Select role</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Create user
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Users</h2>
              <p className="text-sm text-slate-500 mt-0.5">{users.length} total</p>
            </div>
            <button
              type="button"
              onClick={() => { setShowForm(true); setError(""); setSuccess(""); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus size={15} strokeWidth={2.5} />
              Add user
            </button>
          </div>

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm mb-5">
              <UserCheck size={15} />
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm mb-5">
              {error}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {["Name", "Email", "Role", "Profile", "Status", "Action"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-700 text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                      No users yet. Click Add user to create one.
                    </td>
                  </tr>
                ) : (
                  users.map((u, i) => (
                    <tr key={u.id} className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 !== 0 ? "bg-slate-50/40" : ""}`}>
                      <td className="px-5 py-3.5 text-sm text-slate-800 font-medium">
                        {u.first_name || u.last_name
                          ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
                          : <span className="text-slate-300 italic text-xs">Not set</span>
                        }
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{u.email}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{u.role_id}</td>
                      <td className="px-5 py-3.5">
                        {u.profile_completed
                          ? <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-600 bg-green-50 text-green-700 border border-green-200">Complete</span>
                          : <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-600 bg-slate-100 text-slate-500 border border-slate-200">Pending</span>
                        }
                      </td>
                      <td className="px-5 py-3.5">
                        {u.is_active
                          ? <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-600 bg-green-50 text-green-700 border border-green-200">Active</span>
                          : <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-600 bg-red-50 text-red-700 border border-red-200">Inactive</span>
                        }
                      </td>
                      <td className="px-5 py-3.5">
                        {u.role_id !== 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(u.id)}
                            className="text-xs font-600 text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
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
        </div>
      )}
    </Layout>
  );
}