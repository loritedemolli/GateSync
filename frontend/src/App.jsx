import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SettingsPage from "./pages/settings/SettingsPage";
import Layout from "./components/layout/Layout";
import ResidencesPage from "./pages/residences/ResidencesPage";
import ResidentsPage from "./pages/residents/ResidentsPage";
import InvoicesPage from "./pages/invoices/InvoicesPage";
import PaymentsPage from "./pages/payments/PaymentsPage";
import ProblemReportsPage from "./pages/problemreports/ProblemReportsPage";
import ReservationsPage from "./pages/reservations/ReservationsPage";
import VehiclesPage from "./pages/vehicles/VehiclesPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import ReportsPage from "./pages/reports/ReportsPage";
import UsersPage from "./pages/users/UsersPage";
import ResidentDashboard from "./pages/resident/ResidentDashboard";
import MyInvoices from "./pages/resident/MyInvoices";
import MyPayments from "./pages/resident/MyPayments";
import MyProblems from "./pages/resident/MyProblems";
import MyReservations from "./pages/resident/MyReservations";
import MyNotifications from "./pages/resident/MyNotifications";
import MyProfile from "./pages/resident/MyProfile";
import MyVehicles from "./pages/resident/MyVehicles";
import LandingPage from "./pages/landing/LandingPage";
import SecurityDashboard from "./pages/security/SecurityDashboard";
import SecurityPage from "./pages/security/SecurityPage";
import MaintenanceDashboard from "./pages/maintenance/MaintenanceDashboard";
import MaintenanceProblemsPage from "./pages/maintenance/MaintenanceProblemsPage";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <RegisterPage />}
      />

      {/* Dashboardi ndryshon sipas rolit */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role === "Resident" ? (
              <ResidentDashboard />
            ) : user?.role === "Security" ? (
              <SecurityPage />
            ) : user?.role === "Maintenance" ? (
              <MaintenanceDashboard />
            ) : (
              <DashboardPage />
            )}
          </ProtectedRoute>
        }
      />

      {/* SuperAdmin + Admin */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/residences"
        element={
          <ProtectedRoute>
            <ResidencesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/residents"
        element={
          <ProtectedRoute>
            {user?.role === "Security" ? <SecurityPage /> : <ResidentsPage />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <ProtectedRoute>
            {user?.role === "Resident" ? <MyInvoices /> : <InvoicesPage />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            {user?.role === "Resident" ? <MyPayments /> : <PaymentsPage />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/problem-reports"
        element={
          <ProtectedRoute>
            {user?.role === "Resident" ? (
              <MyProblems />
            ) : user?.role === "Maintenance" ? (
              <MaintenanceProblemsPage />
            ) : (
              <ProblemReportsPage />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            {user?.role === "Resident" ? (
              <MyReservations />
            ) : (
              <ReservationsPage />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            {user?.role === "Security" ? <SecurityPage /> : <VehiclesPage />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            {user?.role === "SuperAdmin" || user?.role === "Admin" ? (
              <NotificationsPage />
            ) : (
              <MyNotifications />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      {/* Resident Routes */}
      <Route
        path="/my-invoices"
        element={
          <ProtectedRoute>
            <MyInvoices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute>
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <VehiclesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      {/* Default */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
    </Routes>
  );
}

export default App;
