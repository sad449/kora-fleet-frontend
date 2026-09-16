import Layout from "../../components/Layout";

export default function DriverDashboard() {
  return (
    <Layout>
      <h2 style={{ margin: "0 0 8px 0", color: "#0f172a" }}>Driver Portal</h2>
      <p style={{ color: "#64748b", fontSize: "14px" }}>
        Your assigned vehicle and trips will appear here.
      </p>
    </Layout>
  );
}