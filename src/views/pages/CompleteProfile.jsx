import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../models/api";

export default function CompleteProfile() {
  const { user, refreshUser, navigateByRole } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [personal, setPersonal] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    national_id_number: "",
    address: "",
  });

  const [company, setCompany] = useState({
    company_name: "",
    company_registered_date: "",
    rdb_certificate: "",
    status: "limited_company",
    address: "",
    phone: "",
  });

  async function handlePersonalSubmit(e) {
    e.preventDefault();
    setError("");

    if (!personal.first_name || !personal.last_name) {
      setError("First name and last name are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.post("/auth/personal-details", personal);

      if (result.data.account_type === "individual") {
        const updated = await refreshUser();
        navigateByRole(updated.role_id);
      } else {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCompanySubmit(e) {
    e.preventDefault();
    setError("");

    if (!company.company_name) {
      setError("Company name is required.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/company-profile", company);
      const updated = await refreshUser();
      navigateByRole(updated.role_id);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save company profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <img src="/logo.jpeg" alt="Kora Fleet" style={s.logo} />

        {step === 1 ? (
          <>
            <h2 style={s.title}>Personal details</h2>
            <p style={s.sub}>
              Tell us about yourself before you get started.
              {user?.account_type === "company" && (
                <span style={s.stepIndicator}> Step 1 of 2</span>
              )}
            </p>

            <form onSubmit={handlePersonalSubmit} style={s.form}>
              <div style={s.row}>
                <div style={s.field}>
                  <label style={s.label}>First name</label>
                  <input
                    value={personal.first_name}
                    onChange={e => setPersonal({ ...personal, first_name: e.target.value })}
                    style={s.input}
                    required
                    placeholder="John"
                  />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Last name</label>
                  <input
                    value={personal.last_name}
                    onChange={e => setPersonal({ ...personal, last_name: e.target.value })}
                    style={s.input}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <label style={s.label}>Phone</label>
              <input
                value={personal.phone}
                onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                style={s.input}
                placeholder="+250 7XX XXX XXX"
              />

              <label style={s.label}>National ID number</label>
              <input
                value={personal.national_id_number}
                onChange={e => setPersonal({ ...personal, national_id_number: e.target.value })}
                style={s.input}
                placeholder="1199012345678901"
              />

              <label style={s.label}>Address</label>
              <input
                value={personal.address}
                onChange={e => setPersonal({ ...personal, address: e.target.value })}
                style={s.input}
                placeholder="KG 123 St, Kigali"
              />

              {error && <p style={s.error}>{error}</p>}

              <button type="submit" style={s.btn} disabled={loading}>
                {loading
                  ? "Saving..."
                  : user?.account_type === "company"
                  ? "Next →"
                  : "Save and continue"
                }
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 style={s.title}>Company profile</h2>
            <p style={s.sub}>
              Enter your company details. <span style={s.stepIndicator}>Step 2 of 2</span>
            </p>

            <form onSubmit={handleCompanySubmit} style={s.form}>
              <label style={s.label}>Company name</label>
              <input
                value={company.company_name}
                onChange={e => setCompany({ ...company, company_name: e.target.value })}
                style={s.input}
                required
                placeholder="Kigali Logistics Ltd"
              />

              <label style={s.label}>Company type</label>
              <select
                value={company.status}
                onChange={e => setCompany({ ...company, status: e.target.value })}
                style={s.input}
              >
                <option value="sole_proprietorship">Sole proprietorship</option>
                <option value="limited_company">Limited company</option>
                <option value="partnership">Partnership</option>
              </select>

              <label style={s.label}>Company registered date</label>
              <input
                value={company.company_registered_date}
                onChange={e => setCompany({ ...company, company_registered_date: e.target.value })}
                style={s.input}
                placeholder="e.g. 2020-01-15"
              />

              <label style={s.label}>RDB certificate number</label>
              <input
                value={company.rdb_certificate}
                onChange={e => setCompany({ ...company, rdb_certificate: e.target.value })}
                style={s.input}
                placeholder="RDB/2020/XXXXX"
              />

              <label style={s.label}>Company address</label>
              <input
                value={company.address}
                onChange={e => setCompany({ ...company, address: e.target.value })}
                style={s.input}
                placeholder="KG 123 St, Kigali"
              />

              <label style={s.label}>Company phone</label>
              <input
                value={company.phone}
                onChange={e => setCompany({ ...company, phone: e.target.value })}
                style={s.input}
                placeholder="+250 7XX XXX XXX"
              />

              {error && <p style={s.error}>{error}</p>}

              <div style={s.btnRow}>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  style={s.backBtn}
                >
                  ← Back
                </button>
                <button type="submit" style={s.btn} disabled={loading}>
                  {loading ? "Saving..." : "Save and continue"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
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
    width: "480px",
    border: "1px solid #ccc",
  },
  logo: {
    width: "60px",
    height: "60px",
    objectFit: "contain",
    marginBottom: "16px",
    display: "block",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "20px",
    color: "#0f172a",
  },
  sub: {
    margin: "0 0 24px 0",
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
  },
  stepIndicator: {
    color: "#0f9488",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    gap: "12px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "6px",
    marginTop: "14px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
    color: "#0f172a",
  },
  error: {
    color: "#dc2626",
    fontSize: "13px",
    marginTop: "12px",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    marginTop: "20px",
  },
  btn: {
    flex: 1,
    padding: "11px",
    backgroundColor: "#0f172a",
    color: "#fff",
    border: "none",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "20px",
  },
  backBtn: {
    padding: "11px 20px",
    backgroundColor: "transparent",
    color: "#475569",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "20px",
  },
};