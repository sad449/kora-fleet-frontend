import { useEffect, useState } from "react";
import { Users, UserCheck } from "lucide-react";
import { getUsers, getRoles, deleteUser } from "../../models/userModel";
import Layout from "../../components/Layout";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
    getRoles().then(setRoles).catch(() => {});
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Failed to load users.");
    }
  }

  async function handleDeactivate(id) {
    if (!window.confirm("Deactivate this user?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch {
      setError("Failed to deactivate user.");
    }
  }

  const activeUsers = users.filter(u => u.is_active);

  return (
    <Layout title="Dashboard">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage your fleet users</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm mb-5">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <UserCheck size={18} className="text-blue-600" />
            </div>
            <p className="text-xs font-700 text-slate-500 uppercase tracking-wide">Active users</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{activeUsers.length}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-slate-600" />
            </div>
            <p className="text-xs font-700 text-slate-500 uppercase tracking-wide">Total users</p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{users.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">All users</h3>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-5 py-3 text-[11px] font-700 text-slate-400 uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3 text-[11px] font-700 text-slate-400 uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3 text-[11px] font-700 text-slate-400 uppercase tracking-wider">Role</th>
              <th className="text-left px-5 py-3 text-[11px] font-700 text-slate-400 uppercase tracking-wider">Profile</th>
              <th className="text-left px-5 py-3 text-[11px] font-700 text-slate-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-[11px] font-700 text-slate-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr
                  key={u.id}
                  className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}
                >
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
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-600 bg-green-50 text-green-700 border border-green-200">Complete</span>
                      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-600 bg-slate-100 text-slate-500 border border-slate-200">Pending</span>
                    }
                  </td>
                  <td className="px-5 py-3.5">
                    {u.is_active
                      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-600 bg-green-50 text-green-700 border border-green-200">Active</span>
                      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-600 bg-red-50 text-red-700 border border-red-200">Inactive</span>
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
    </Layout>
  );
}