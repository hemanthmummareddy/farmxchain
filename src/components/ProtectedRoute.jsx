import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

<<<<<<< HEAD
const dashboardByRole = {
  FARMER: "/farmer/dashboard",
  CUSTOMER: "/customer/dashboard",
  DISTRIBUTOR: "/distributor/dashboard",
  ADMIN: "/admin/dashboard",
};

=======
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
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

<<<<<<< HEAD
  // Role mismatch: send the user to their own dashboard
  const userRole = (user.role || "").toUpperCase();
  if (role && userRole !== role.toUpperCase()) {
    return (
      <Navigate to={dashboardByRole[userRole] || "/login"} replace />
    );
=======
  // Role mismatch
  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/dashboard" replace />;
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
  }

  return children;
};

<<<<<<< HEAD
export default ProtectedRoute;
=======
export default ProtectedRoute;
>>>>>>> a388ef0ce6e7515e6af06fbce909ca27416d71cf
