import { Car, MapPin } from "lucide-react";
import Layout from "../../components/Layout";

export default function DriverDashboard() {
  return (
    <Layout title="Driver Portal">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">My portal</h2>
        <p className="text-sm text-slate-500 mt-0.5">Your vehicle and trips</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
          <Car size={28} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">No vehicle assigned</p>
          <p className="text-xs text-slate-400 mt-1">Contact your fleet manager</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center">
          <MapPin size={28} className="text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">No trips assigned</p>
          <p className="text-xs text-slate-400 mt-1">Trips will appear here</p>
        </div>
      </div>
    </Layout>
  );
}