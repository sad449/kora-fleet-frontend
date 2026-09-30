import { BarChart2 } from "lucide-react";
import Layout from "../../components/Layout";

export default function ManagementDashboard() {
  return (
    <Layout title="Management View">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500 mt-0.5">Fleet reports and summaries</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm text-center">
        <BarChart2 size={32} className="text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-slate-600 mb-1">Reports coming soon</h3>
        <p className="text-xs text-slate-400">Analytics and fleet summaries will appear here</p>
      </div>
    </Layout>
  );
}