import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import api from "../../models/api";

export default function SetPassword() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ old_password: "", new_password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.new_password !== form.confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (form.new_password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        old_password: form.old_password,
        new_password: form.new_password,
      });
      await refreshUser();
      navigate("/complete-profile");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-100 p-10 w-full max-w-md">

        <div className="flex items-center gap-3 mb-7">
          <img src="/logo.jpeg" alt="Kora Fleet" className="w-10 h-10 rounded-xl object-contain" />
          <div>
            <p className="text-sm font-bold text-slate-900">Kora Fleet</p>
            <p className="text-xs text-slate-400">First time login</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <KeyRound size={18} className="text-slate-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Set your password</h2>
            <p className="text-xs text-slate-500">Choose a strong password to continue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-600 text-slate-600">Current password</label>
            <input
              type="password"
              value={form.old_password}
              onChange={e => setForm({ ...form, old_password: e.target.value })}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              required
              placeholder="Your temporary password"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-600 text-slate-600">New password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={form.new_password}
                onChange={e => setForm({ ...form, new_password: e.target.value })}
                className="w-full px-3 py-2.5 pr-10 border border-slate-200 rounded-lg text-sm outline-none text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                required
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-600 text-slate-600">Confirm new password</label>
            <input
              type="password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              required
              placeholder="Repeat your new password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Set password and continue"}
          </button>
        </form>
      </div>
    </div>
  );
}