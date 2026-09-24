import { useState } from "react";
import { Car, UserCheck, Map, TrendingUp, LayoutDashboard } from "lucide-react";
import Layout from "../../components/Layout";

const TABS = {
  dashboard: "Dashboard",
  vehicles: "Vehicles",
  drivers: "Drivers",
  trips: "Trips",
};

function DashboardContent() {
  const cards = [
    { icon: Car, label: "Vehicles", color: "bg-blue-50 text-blue-600" },
    { icon: UserCheck, label: "Drivers", color: "bg-green-50 text-green-600" },
    { icon: Map, label: "Active trips", color: "bg-amber-50 text-amber-600" },
    { icon: TrendingUp, label: "This month", color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">Fleet data will appear here once vehicles and drivers are added</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map(({ icon: Icon, label, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900">—</p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-center">
        <Car size={32} className="text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-600 mb-1">No data yet</h3>
        <p className="text-xs text-slate-400">Use the sidebar to manage vehicles, drivers, and trips</p>
      </div>
    </>
  );
}

function ComingSoon({ title, icon: Icon }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-sm text-center">
        <Icon size={36} className="text-slate-200 mx-auto mb-4" />
        <h3 className="text-base font-semibold text-slate-500 mb-2">{title} — coming soon</h3>
        <p className="text-sm text-slate-400">This section is being built by the development team.</p>
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  const [active, setActive] = useState("dashboard");

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "vehicles", label: "Vehicles", icon: Car },
    { key: "drivers", label: "Drivers", icon: UserCheck },
    { key: "trips", label: "Trips", icon: Map },
  ];

  function renderContent() {
    if (active === "dashboard") return <DashboardContent />;
    if (active === "vehicles") return <ComingSoon title="Vehicles" icon={Car} />;
    if (active === "drivers") return <ComingSoon title="Drivers" icon={UserCheck} />;
    if (active === "trips") return <ComingSoon title="Trips" icon={Map} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-60 bg-slate-900 flex flex-col z-50">
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Kora Fleet" className="w-8 h-8 rounded-lg object-contain" />
            <div>
              <p className="text-white text-sm font-bold tracking-tight">Kora Fleet</p>
              <p className="text-slate-500 text-[10px]">Fleet Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-all
                ${active === key
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                }`}
            >
              <Icon size={16} strokeWidth={2} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); window.location.href = "/login"; }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-red-500/10 hover:text-red-400 w-full text-left transition-all"
          >
            ↩ Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-slate-900">{TABS[active]}</h1>
        </header>
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}