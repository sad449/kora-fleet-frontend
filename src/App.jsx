import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./views/pages/Login";
import Dashboard from "./views/pages/Dashboard";
import ManagerDashboard from "./views/pages/ManagerDashboard";
import ManagementDashboard from "./views/pages/ManagementDashboard";
import DriverDashboard from "./views/pages/DriverDashboard";
import Users from "./views/pages/Users";
import SetPassword from "./views/pages/SetPassword";
import CompleteProfile from "./views/pages/CompleteProfile";

function ComingSoon({ title }) {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "24px", padding: "8px 16px", backgroundColor: "#0f172a", color: "#fff", border: "none", cursor: "pointer" }}
      >
        ← Back
      </button>
      <h2 style={{ color: "#0f172a" }}>{title}</h2>
      <p style={{ color: "#64748b", marginTop: "8px" }}>This section is being built. Check back soon.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/set-password" element={
            <ProtectedRoute><SetPassword /></ProtectedRoute>
          } />

          <Route path="/complete-profile" element={
            <ProtectedRoute><CompleteProfile /></ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />

          <Route path="/manager" element={
            <ProtectedRoute><ManagerDashboard /></ProtectedRoute>
          } />

          <Route path="/management" element={
            <ProtectedRoute><ManagementDashboard /></ProtectedRoute>
          } />

          <Route path="/driver" element={
            <ProtectedRoute><DriverDashboard /></ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute><Users /></ProtectedRoute>
          } />

          <Route path="/vehicles" element={
            <ProtectedRoute><ComingSoon title="Vehicles" /></ProtectedRoute>
          } />

          <Route path="/drivers" element={
            <ProtectedRoute><ComingSoon title="Drivers" /></ProtectedRoute>
          } />

          <Route path="/trips" element={
            <ProtectedRoute><ComingSoon title="Trips" /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}