import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={s.shell}>
<div style={s.sidebar}>
  <div style={s.logoWrap}>
    <img src="/logo.jpeg" alt="Kora Fleet" style={s.logo} />
  </div>
  <p style={s.brand}>KORA FLEET</p>
  <button type="button" onClick={() => navigate("/manager")} style={s.navBtn}>
    Dashboard
  </button>
  <button type="button" onClick={() => navigate("/vehicles")} style={s.navBtn}>
    Vehicles
  </button>
  <button type="button" onClick={() => navigate("/drivers")} style={s.navBtn}>
    Drivers
  </button>
  <button type="button" onClick={() => navigate("/trips")} style={s.navBtn}>
    Trips
  </button>
</div>

      <div style={s.main}>
        <div style={s.topbar}>
          <h1 style={s.pageTitle}>Fleet Manager Dashboard</h1>
          <div style={s.topRight}>
            <span style={s.whoami}>{user?.full_name}</span>
            <button onClick={logout} style={s.logoutBtn}>Log out</button>
          </div>
        </div>

        <div style={s.content}>
          <p style={s.welcome}>Welcome, {user?.full_name}.</p>
          <p style={s.sub}>Vehicles, drivers, and trips will appear here as they are added to the system.</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif" },
  sidebar: { width: "210px", backgroundColor: "#0f172a", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0 },
  logoWrap: { marginBottom: "16px", display: "flex", justifyContent: "center" },
  logo: { width: "70px", height: "70px", objectFit: "contain" },
  brand: { color: "#94a3b8", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", margin: "0 0 16px 0", textAlign: "center" },
  navBtn: { padding: "10px 14px", backgroundColor: "transparent", color: "#e2e8f0", border: "none", cursor: "pointer", textAlign: "left", fontSize: "14px" },
  main: { flex: 1, backgroundColor: "#f8fafc", display: "flex", flexDirection: "column" },
  topbar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" },
  pageTitle: { margin: 0, fontSize: "18px", color: "#0f172a" },
  topRight: { display: "flex", alignItems: "center", gap: "16px" },
  whoami: { fontSize: "14px", color: "#475569" },
  logoutBtn: { padding: "7px 16px", backgroundColor: "#0f172a", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px" },
  content: { padding: "40px 32px" },
  welcome: { fontSize: "16px", color: "#0f172a", marginBottom: "8px" },
  sub: { fontSize: "14px", color: "#64748b" },
};