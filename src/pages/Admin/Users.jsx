import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminUsers, deleteUser } from "../../services/AdminService";
import toast from "react-hot-toast";

const roleBadge = (role) => {
  const map = {
    ADMIN: "bg-purple-100 text-purple-700",
    FARMER: "bg-green-100 text-green-700",
    DISTRIBUTOR: "bg-blue-100 text-blue-700",
    CUSTOMER: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        map[role] || "bg-gray-100 text-gray-700"
      }`}
    >
      {role}
    </span>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = () => {
    fetchAdminUsers()
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const removeUser = (uniqueId, role, e) => {
    e.stopPropagation();

    if (role === "ADMIN") {
      toast.error("Admin users cannot be deleted");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    deleteUser(uniqueId)
      .then(() => {
        toast.success("User deleted");
        loadUsers();
      })
      .catch(() => toast.error("Delete failed"));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Email</th>
              <th className="text-left px-6 py-4 font-semibold">Role</th>
              <th className="text-right px-6 py-4 font-semibold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.uniqueId}
                onClick={() =>
                  navigate(`/admin/users/${u.uniqueId}`)
                }
                className="border-b hover:bg-indigo-50 cursor-pointer transition"
              >
                <td className="px-6 py-4">{u.email}</td>

                <td className="px-6 py-4">
                  {roleBadge(u.role)}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) =>
                      removeUser(u.uniqueId, u.role, e)
                    }
                    className="px-3 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
