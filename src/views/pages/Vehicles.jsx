import { useEffect, useState } from "react";
import { Plus, X, Car, CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";
import { getVehicles, createVehicle, deleteVehicle } from "../../models/vehicleModel";

const STATUS_STYLES = {
  available: { label: "Available", classes: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle },
  in_use: { label: "In use", classes: "bg-blue-50 text-blue-700 border-blue-200", icon: Car },
  maintenance: { label: "Maintenance", classes: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  inactive: { label: "Inactive", classes: "bg-slate-100 text-slate-500 border-slate-200", icon: XCircle },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.inactive;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.classes}`}>
      <Icon size={11} strokeWidth={2.5} />
      {s.label}
    </span>
  );
}

const EMPTY_FORM = {
  plate_number: "",
  make: "",
  model: "",
  year: "",
  mileage: "0",
  capacity: "",
  status: "available",
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
  try {
    const data = await getVehicles();
    setVehicles(data);
  } catch {
    setVehicles([]);
  }
}
  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await createVehicle({
        plate_number: form.plate_number,
        make: form.make || null,
        model: form.model || null,
        year: form.year ? parseInt(form.year) : null,
        mileage: parseInt(form.mileage) || 0,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        status: form.status,
      });
      setSuccess(`Vehicle ${form.plate_number} added successfully.`);
      setForm(EMPTY_FORM);
      setShowForm(false);
      loadVehicles();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add vehicle.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate(id, plate) {
    if (!window.confirm(`Deactivate vehicle ${plate}?`)) return;
    try {
      await deleteVehicle(id);
      loadVehicles();
    } catch {
      setError("Failed to deactivate vehicle.");
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const inputCls = "px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all w-full bg-white font-sans";
  const labelCls = "text-xs font-semibold text-slate-600 mb-1.5 block";

  return (
    <div>
      {showForm ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Add vehicle</h2>
              <p className="text-sm text-slate-500 mt-0.5">Register a new vehicle to the fleet</p>
            </div>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(""); }}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X size={15} />
              Back to vehicles
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-2xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Plate number <span className="text-red-500">*</span></label>
                  <input
                    name="plate_number"
                    value={form.plate_number}
                    onChange={handleChange}
                    className={inputCls}
                    required
                    placeholder="RAB 123 A"
                  />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={inputCls}
                  >
                    <option value="available">Available</option>
                    <option value="in_use">In use</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Make</label>
                  <input
                    name="make"
                    value={form.make}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <label className={labelCls}>Model</label>
                  <input
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="Land Cruiser"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className={labelCls}>Year</label>
                  <input
                    name="year"
                    type="number"
                    value={form.year}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="2022"
                    min="1990"
                    max="2030"
                  />
                </div>
                <div>
                  <label className={labelCls}>Mileage (km)</label>
                  <input
                    name="mileage"
                    type="number"
                    value={form.mileage}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <label className={labelCls}>Capacity (seats)</label>
                  <input
                    name="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={handleChange}
                    className={inputCls}
                    placeholder="5"
                    min="1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add vehicle"}
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Vehicles</h2>
              <p className="text-sm text-slate-500 mt-0.5">{vehicles.length} registered</p>
            </div>
            <button
              type="button"
              onClick={() => { setShowForm(true); setError(""); setSuccess(""); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Plus size={15} strokeWidth={2.5} />
              Add vehicle
            </button>
          </div>

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm mb-5">
              <CheckCircle size={15} />
              {success}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {["Plate", "Make / Model", "Year", "Mileage", "Capacity", "Status", "Action"].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center">
                      <Car size={32} className="text-slate-200 mx-auto mb-3" />
                      <p className="text-sm text-slate-400">No vehicles yet. Click Add vehicle to register one.</p>
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v, i) => (
                    <tr
                      key={v.id}
                      className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 !== 0 ? "bg-slate-50/40" : ""}`}
                    >
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{v.plate_number}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {v.make || v.model
                          ? `${v.make || ""} ${v.model || ""}`.trim()
                          : <span className="text-slate-300 italic text-xs">Not set</span>
                        }
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">{v.year || "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {v.mileage != null ? `${v.mileage.toLocaleString()} km` : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {v.capacity ? `${v.capacity} seats` : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleDeactivate(v.id, v.plate_number)}
                          className="text-xs font-semibold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}