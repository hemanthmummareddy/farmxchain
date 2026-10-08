import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardByRole = {
  FARMER: "/farmer/dashboard",
  CUSTOMER: "/customer/dashboard",
  DISTRIBUTOR: "/distributor/dashboard",
  ADMIN: "/admin/dashboard",
};

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  // Still loading profile
  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch: send the user to their own dashboard
  const userRole = (user.role || "").toUpperCase();
  if (role && userRole !== role.toUpperCase()) {
    return (
      <Navigate to={dashboardByRole[userRole] || "/login"} replace />
    );
  }

  return children;
};

export default ProtectedRoute;