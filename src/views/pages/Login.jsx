
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
     
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Kora Fleet</h1>
        <p style={styles.sub}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="admin@korafleet.local"
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
    fontFamily: "sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    width: "360px",
    border: "1px solid #ccc",
  },
  title: {
    margin: "0 0 4px 0",
    fontSize: "22px",
    color: "#0f172a",
  },
  sub: {
    margin: "0 0 28px 0",
    color: "#64748b",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "13px",
    color: "#0f172a",
    marginBottom: "6px",
    fontWeight: "600",
  },
  input: {
    padding: "10px",
    marginBottom: "18px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
  },
  error: {
    color: "#dc2626",
    fontSize: "13px",
    marginBottom: "12px",
  },
  button: {
    padding: "11px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
  },
};