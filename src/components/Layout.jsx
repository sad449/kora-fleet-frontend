import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Users", path: "/users" },
  ];

  const managerLinks = [
    { label: "Dashboard", path: "/manager" },
    { label: "Vehicles", path: "/vehicles" },
    { label: "Drivers", path: "/drivers" },
    { label: "Trips", path: "/trips" },
  ];

  const managementLinks = [
    { label: "Dashboard", path: "/management" },
  ];

  const driverLinks = [
    { label: "Dashboard", path: "/driver" },
  ];

  function getLinks() {
    if (!user) return [];
    if (user.role_id === 1) return adminLinks;
    if (user.role_id === 2) return managerLinks;
    if (user.role_id === 3) return managementLinks;
    if (user.role_id === 4) return driverLinks;
    return [];
  }

  return (
    <div style={s.shell}>
      <div style={s.sidebar}>
        <div style={s.logoWrap}>
          <img src="/logo.jpeg" alt="Kora Fleet" style={s.logo} />
        </div>
        <p style={s.brand}>KORA FLEET</p>
        {getLinks().map(link => (
          <button
            key={link.path}
            type="button"
            onClick={() => navigate(link.path)}
            style={s.navBtn}
          >
            {link.label}
          </button>
        ))}
        <div style={s.spacer} />
        <button type="button" onClick={logout} style={s.logoutBtn}>
          Log out
        </button>
      </div>

      <div style={s.body}>
        <div style={s.topbar}>
          <span style={s.whoami}>
            {user?.full_name || user?.email}
          </span>
        </div>
        <div style={s.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: { display: "flex", minHeight: "100vh", fontFamily: "sans-serif" },
  sidebar: {
    width: "210px",
    backgroundColor: "#0f172a",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flexShrink: 0,
  },
  logoWrap: { marginBottom: "12px", display: "flex", justifyContent: "center" },
  logo: { width: "70px", height: "70px", objectFit: "contain" },
  brand: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    margin: "0 0 16px 0",
    textAlign: "center",
  },
  navBtn: {
    padding: "10px 14px",
    backgroundColor: "transparent",
    color: "#e2e8f0",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
  },
  spacer: { flex: 1 },
  logoutBtn: {
    padding: "10px 14px",
    backgroundColor: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "13px",
    marginTop: "8px",
  },
  body: { flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" },
  topbar: {
    padding: "14px 32px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "flex-end",
  },
  whoami: { fontSize: "14px", color: "#475569" },
  content: { flex: 1, padding: "32px" },
};