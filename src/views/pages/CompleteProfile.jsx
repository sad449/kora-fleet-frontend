import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Upload, CheckCircle, Building2, User } from "lucide-react";
import api from "../../models/api";

export default function CompleteProfile() {
  const { refreshUser, navigateByRole } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");

  const [personal, setPersonal] = useState({
    first_name: "", last_name: "", phone: "",
    national_id_number: "", address: "",
  });

  const [company, setCompany] = useState({
    company_name: "", company_type: "solo",
    company_registered_date: "", rdb_certificate: "",
    address: "", phone: "",
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
      setError(err.response?.data?.detail || "Failed to save.");
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
      const res = await api.post("/auth/upload-certificate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedFile(res.data.filename);
      setCompany(c => ({ ...c, rdb_certificate: res.data.filename }));
    } catch {
      setError("Upload failed. Try again.");
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
      setError(err.response?.data?.detail || "Failed to save.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all w-full font-sans bg-white";
  const labelCls = "text-xs font-600 text-slate-600 mb-1.5 block";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-5 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-100 p-10 w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.jpeg" alt="Kora Fleet" className="w-10 h-10 rounded-xl object-contain" />
          <div>
            <p className="text-sm font-bold text-slate-900">Kora Fleet</p>
            <p className="text-xs text-slate-400">Complete your profile</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-7">
          <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? "bg-blue-600" : "bg-slate-200"}`} />
          <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? "bg-blue-600" : "bg-slate-200"}`} />
        </div>

        {step === 1 ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Personal details</h2>
                <p className="text-xs text-slate-500">Step 1 of 2</p>
              </div>
            </div>

            <form onSubmit={handlePersonalSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First name</label>
                  <input className={inputCls} value={personal.first_name}
                    onChange={e => setPersonal({ ...personal, first_name: e.target.value })}
                    required placeholder="John" />
                </div>
                <div>
                  <label className={labelCls}>Last name</label>
                  <input className={inputCls} value={personal.last_name}
                    onChange={e => setPersonal({ ...personal, last_name: e.target.value })}
                    required placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Phone</label>
                <input className={inputCls} value={personal.phone}
                  onChange={e => setPersonal({ ...personal, phone: e.target.value })}
                  placeholder="+250 7XX XXX XXX" />
              </div>

              <div>
                <label className={labelCls}>National ID number</label>
                <input className={inputCls} value={personal.national_id_number}
                  onChange={e => setPersonal({ ...personal, national_id_number: e.target.value })}
                  placeholder="1199012345678901" />
              </div>

              <div>
                <label className={labelCls}>Address</label>
                <input className={inputCls} value={personal.address}
                  onChange={e => setPersonal({ ...personal, address: e.target.value })}
                  placeholder="KG 123 St, Kigali" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60"
              >
                {loading ? "Saving..." : "Next →"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Building2 size={18} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Company profile</h2>
                <p className="text-xs text-slate-500">Step 2 of 2</p>
              </div>
            </div>

            <form onSubmit={handleCompanySubmit} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Company name</label>
                <input className={inputCls} value={company.company_name}
                  onChange={e => setCompany({ ...company, company_name: e.target.value })}
                  required placeholder="Kigali Logistics Ltd" />
              </div>

              <div>
                <label className={labelCls}>Company type</label>
                <select className={inputCls} value={company.company_type}
                  onChange={e => setCompany({ ...company, company_type: e.target.value })}>
                  <option value="solo">Solo — fully owned</option>
                  <option value="company">Company — has shareholders</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Company registered date</label>
                <input type="date" className={inputCls} value={company.company_registered_date}
                  onChange={e => setCompany({ ...company, company_registered_date: e.target.value })} />
              </div>

              {/* File upload */}
              <div>
                <label className={labelCls}>RDB certificate</label>
                {!uploadedFile ? (
                  <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-lg px-4 py-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                    <Upload size={20} className={uploading ? "text-blue-500 animate-bounce" : "text-slate-400"} />
                    <span className="text-sm text-slate-500">
                      {uploading ? "Uploading..." : "Click to upload PDF, JPG, or PNG"}
                    </span>
                    <span className="text-xs text-slate-400">Max 5MB</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
                    <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-800 font-medium truncate">{uploadedFile}</span>
                    <button
                      type="button"
                      onClick={() => { setUploadedFile(""); setCompany(c => ({ ...c, rdb_certificate: "" })); }}
                      className="ml-auto text-xs text-green-600 hover:text-green-800"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className={labelCls}>Company address</label>
                <input className={inputCls} value={company.address}
                  onChange={e => setCompany({ ...company, address: e.target.value })}
                  placeholder="KG 123 St, Kigali" />
              </div>

              <div>
                <label className={labelCls}>Company phone</label>
                <input className={inputCls} value={company.phone}
                  onChange={e => setCompany({ ...company, phone: e.target.value })}
                  placeholder="+250 7XX XXX XXX" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  className="px-5 py-3 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 py-3 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60"
                >
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