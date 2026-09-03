// the dashboard,shows nothing for now , just proves login worked

import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#fff", margin: 0 }}>Kora Fleet</h1>
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#0f172a",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>

      <hr style={{ margin: "24px 0", borderColor: "#e2e8f0" }} />

      <p style={{ color: "#475569" }}>
        Logged in as <strong>{user?.full_name}</strong>
      </p>
      <p style={{ color: "#475569" }}>
        Role ID: <strong>{user?.role_id}</strong>
      </p>
    </div>
  );
}