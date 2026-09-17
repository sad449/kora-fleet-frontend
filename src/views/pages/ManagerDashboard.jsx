import Layout from "../../components/Layout";

export default function ManagerDashboard() {
  return (
    <Layout>
      <h2 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>Fleet Manager Dashboard</h2>
      <p style={{ color: "#64748b", fontSize: "14px" }}>
        Vehicles, drivers, and trips will appear here as they are added.
      </p>
    </Layout>
  );
}