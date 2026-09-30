import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, Car, UserCheck, Map,
  LogOut, ChevronRight
} from "lucide-react";

const NAV = {
  1: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/users", icon: Users },
  ],
  2: [
    { label: "Dashboard", path: "/manager", icon: LayoutDashboard },
    { label: "Vehicles", path: "/vehicles", icon: Car },
    { label: "Drivers", path: "/drivers", icon: UserCheck },
    { label: "Trips", path: "/trips", icon: Map },
  ],
  3: [
    { label: "Dashboard", path: "/management", icon: LayoutDashboard },
  ],
  4: [
    { label: "Dashboard", path: "/driver", icon: LayoutDashboard },
  ],
};

export default function Layout({ children, title = "" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = NAV[user?.role_id] || [];
  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-60 bg-slate-900 flex flex-col z-50">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="Kora Fleet"
              className="w-8 h-8 rounded-lg object-contain"
            />
            <div>
              <p className="text-white text-sm font-bold tracking-tight">Kora Fleet</p>
              <p className="text-slate-500 text-[10px]">Fleet Management</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {links.map(({ label, path, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-all duration-150
                  ${active
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                  }`}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto text-blue-400" />}
              </button>
            );
          })}
        </nav>

        {/* Bottom — user info + logout */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <span className="text-slate-300 text-xs font-medium truncate">
              {user?.full_name || user?.email}
            </span>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-red-500/10 hover:text-red-400 w-full text-left transition-all duration-150"
          >
            <LogOut size={15} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-slate-900">{title}</h1>
          <span className="text-sm text-slate-400">{user?.full_name || user?.email}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}