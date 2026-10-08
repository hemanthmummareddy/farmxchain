import API from "../api/api";

/**
 * Used by AdminDashboard
 */
export const fetchAdminUsers = () => {
  return API.get("/admin/users");
};

/**
 * Used by Admin Users page
 * (alias for clarity)
 */
export const fetchAllUsers = () => {
  return API.get("/admin/users");
};

/**
 * Delete user by uniqueId
 * (make sure backend endpoint exists)
 */
export const deleteUser = (uniqueId) => {
  return API.delete(`/admin/users/${uniqueId}`);
};
