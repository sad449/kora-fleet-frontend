import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../models/userModel";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setError("Failed to load users."));
  }, []);

  const activeUsers = users.filter(u => u.is_active);

  return (
    <div style={s.shell}>
      <div style={s.sidebar}>
        <div style={s.logoWrap}>
          <img src="/logo.jpeg" alt="Kora Fleet" style={s.logo} />
        </div>
        <p style={s.brand}>KORA FLEET</p>
      <button type="button" onClick={() => navigate("/dashboard")} style={s.navBtn}>
  Dashboard
</button>
        <button onClick={() => navigate("/users")} style={s.navBtn}>
          Users
        </button>
      </div>

      <div style={s.main}>
        <div style={s.topbar}>
          <h1 style={s.pageTitle}>Dashboard</h1>
          <div style={s.topRight}>
            <span style={s.whoami}>{user?.full_name}</span>
            <button onClick={logout} style={s.logoutBtn}>Log out</button>
          </div>
        </div>

        {error && <p style={s.error}>{error}</p>}

        <div style={s.cards}>
          <div style={s.card}>
            <p style={s.cardLabel}>Active users</p>
            <p style={s.cardNum}>{activeUsers.length}</p>
          </div>
          <div style={s.card}>
            <p style={s.cardLabel}>Total users</p>
            <p style={s.cardNum}>{users.length}</p>
          </div>
        </div>

        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h2 style={s.sectionTitle}>Active users</h2>
            <button onClick={() => navigate("/users")} style={s.addBtn}>
              + Add user
            </button>
          </div>

          {activeUsers.length === 0 ? (
            <p style={s.empty}>No users yet. Click Add user to create one.</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9" }}>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Role</th>
                  <th style={s.th}>Type</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.map((u, i) => (
                  <tr key={u.id} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                    <td style={s.td}>{u.first_name} {u.last_name}</td>
                    <td style={s.td}>{u.email}</td>
                    <td style={s.td}>{u.role_id}</td>
                    <td style={s.td}>{u.account_type}</td>
                    <td style={s.td}>
                      <span style={s.badge}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    backgroundColor: "#f8fafc",
  },
  sidebar: {
    width: "210px",
    backgroundColor: "#0f172a",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    flexShrink: 0,
  },
  logoWrap: {
    marginBottom: "16px",
    display: "flex",
    justifyContent: "center",
  },
  logo: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    borderRadius: "4px",
  },
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
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8fafc",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 32px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
  },
  pageTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#0f172a",
  },
  topRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  whoami: {
    fontSize: "14px",
    color: "#475569",
  },
  logoutBtn: {
    padding: "7px 16px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
  },
  error: {
    color: "#dc2626",
    padding: "16px 32px",
    fontSize: "13px",
  },
  cards: {
    display: "flex",
    gap: "16px",
    padding: "28px 32px 0",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    padding: "20px 28px",
    minWidth: "160px",
  },
  cardLabel: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardNum: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
  },
  section: {
    margin: "28px 32px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "16px",
    color: "#0f172a",
  },
  addBtn: {
    padding: "8px 18px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
  },
  empty: {
    color: "#94a3b8",
    fontSize: "14px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #e2e8f0",
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
  badge: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: "600",
  },
};