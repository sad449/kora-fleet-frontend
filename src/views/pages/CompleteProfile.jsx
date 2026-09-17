import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../models/api";
import "../../styles/CompleteProfile.css";

export default function CompleteProfile() {
  const { refreshUser, navigateByRole } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");

  const [personal, setPersonal] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    national_id_number: "",
    address: "",
  });

  const [company, setCompany] = useState({
    company_name: "",
    company_type: "solo",
    company_registered_date: "",
    rdb_certificate: "",
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
      await api.post("/auth/personal-details", personal);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save personal details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowed.includes(file.type)) {
      setError("Only PDF, JPG, and PNG files are allowed.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/auth/upload-certificate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadedFile(response.data.filename);
      setCompany({ ...company, rdb_certificate: response.data.filename });
    } catch (err) {
      setError("Failed to upload file. Try again.");
    } finally {
      setUploading(false);
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
    <div className="cp-page">
      <div className="cp-card">
        <img src="/logo.jpeg" alt="Kora Fleet" className="cp-logo" />

        {step === 1 ? (
          <>
            <h2 className="cp-title">Personal details</h2>
            <p className="cp-sub">
              Fill in your personal information.{" "}
              <span className="cp-step">Step 1 of 2</span>
            </p>

            <form onSubmit={handlePersonalSubmit} className="cp-form">
              <div className="cp-row">
                <div className="cp-field">
                  <label className="cp-label">First name</label>
                  <input
                    className="cp-input"
                    value={personal.first_name}
                    onChange={e => setPersonal({ ...personal, first_name: e.target.value })}
                    required
                    placeholder="John"
                  />
                </div>
                <div className="cp-field">
                  <label className="cp-label">Last name</label>
                  <input
                    className="cp-input"
                    value={personal.last_name}
                    onChange={e => setPersonal({ ...personal, last_name: e.target.value })}
                    required
                    placeholder="Doe"
                  />
                </div>
              </div>

              <label className="cp-label">Phone</label>
              <input
                className="cp-input"
                value={personal.phone}
                onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                placeholder="+250 7XX XXX XXX"
              />

              <label className="cp-label">National ID number</label>
              <input
                className="cp-input"
                value={personal.national_id_number}
                onChange={e => setPersonal({ ...personal, national_id_number: e.target.value })}
                placeholder="1199012345678901"
              />

              <label className="cp-label">Address</label>
              <input
                className="cp-input"
                value={personal.address}
                onChange={e => setPersonal({ ...personal, address: e.target.value })}
                placeholder="KG 123 St, Kigali"
              />

              {error && <p className="cp-error">{error}</p>}

              <div className="cp-btn-row">
                <button type="submit" className="cp-btn" disabled={loading}>
                  {loading ? "Saving..." : "Next →"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="cp-title">Company profile</h2>
            <p className="cp-sub">
              Enter your company details.{" "}
              <span className="cp-step">Step 2 of 2</span>
            </p>

            <form onSubmit={handleCompanySubmit} className="cp-form">
              <label className="cp-label">Company name</label>
              <input
                className="cp-input"
                value={company.company_name}
                onChange={e => setCompany({ ...company, company_name: e.target.value })}
                required
                placeholder="Kigali Logistics Ltd"
              />

              <label className="cp-label">Company type</label>
              <select
                className="cp-select"
                value={company.company_type}
                onChange={e => setCompany({ ...company, company_type: e.target.value })}
              >
                <option value="solo">Solo — fully owned</option>
                <option value="company">Company — has shareholders</option>
              </select>

              <label className="cp-label">Company registered date</label>
              <input
                type="date"
                className="cp-input"
                value={company.company_registered_date}
                onChange={e => setCompany({ ...company, company_registered_date: e.target.value })}
              />

              <div className="cp-file-wrap">
                <label className="cp-file-label">RDB certificate</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="cp-file-input"
                />
                <p className="cp-file-note">PDF, JPG, or PNG. Max 5MB.</p>
                {uploading && <p className="cp-uploading">Uploading...</p>}
                {uploadedFile && !uploading && (
                  <p className="cp-uploaded">✓ File uploaded: {uploadedFile}</p>
                )}
              </div>

              <label className="cp-label">Company address</label>
              <input
                className="cp-input"
                value={company.address}
                onChange={e => setCompany({ ...company, address: e.target.value })}
                placeholder="KG 123 St, Kigali"
              />

              <label className="cp-label">Company phone</label>
              <input
                className="cp-input"
                value={company.phone}
                onChange={e => setCompany({ ...company, phone: e.target.value })}
                placeholder="+250 7XX XXX XXX"
              />

              {error && <p className="cp-error">{error}</p>}

              <div className="cp-btn-row">
                <button
                  type="button"
                  className="cp-back-btn"
                  onClick={() => { setStep(1); setError(""); }}
                >
                  ← Back
                </button>
                <button type="submit" className="cp-btn" disabled={loading || uploading}>
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