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
      {/* Background Gradient Blob Effect */}
      <div style={styles.bgGlow} />

      <div style={styles.card}>
        {/* Logo Section */}
        <div style={styles.header}>
          <img
            src="/logo.jpeg" /* Replace with /logo.svg or /logo.png depending on your file extension */
            alt="Kora Fleet Logo"
            style={styles.logo}
          />
          <h1 style={styles.title}>Kora Fleet</h1>
          <p style={styles.sub}>Sign in to your account</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <svg style={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="admin@korafleet.local"
              required
            />
          </div>

          <div style={styles.fieldGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label} htmlFor="password">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.loaderContainer}>
                <span style={styles.spinner}></span>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p style={styles.footerText}>
          Need help? Contact <a href="#" style={styles.link}>System Administrator</a>
        </p>
      </div>

      {/* Keyframe animations injected for smooth transitions */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
        }
        button:hover:not(:disabled) {
          background-color: #1e293b !important;
          transform: translateY(-1px);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
  },
  bgGlow: {
    position: "absolute",
    width: "600px",
    height: "600px",
    background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(255,255,255,0) 70%)",
    top: "-150px",
    right: "-150px",
    pointerEvents: "none",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
    border: "1px solid #e2e8f0",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
  },
  logo: {
    height: "145.9px",
    width: "auto",
    marginBottom: "16px",
    objectFit: "contain",
  },
  title: {
    margin: "0 0 6px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  sub: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "13px",
    color: "#334155",
    marginBottom: "8px",
    fontWeight: "600",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.2s ease",
    backgroundColor: "#ffffff",
    color: "#0f172a",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  errorIcon: {
    width: "18px",
    height: "18px",
    flexShrink: 0,
  },
  button: {
    padding: "12px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    marginTop: "4px",
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    display: "inline-block",
  },
  footerText: {
    textAlign: "center",
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "28px",
    marginBottom: 0,
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
};