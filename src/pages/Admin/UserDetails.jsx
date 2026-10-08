import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import toast from "react-hot-toast";

const UserDetails = () => {
  const { uniqueId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get(`/admin/users`)
      .then((res) => {
        const found = res.data.find(
          (u) => u.uniqueId === uniqueId
        );
        setUser(found);
      })
      .catch(() => toast.error("Failed to load user"));
  }, [uniqueId]);

  const handleDelete = () => {
    if (!window.confirm("Delete this user?")) return;

    API.delete(`/admin/users/${uniqueId}`)
      .then(() => {
        toast.success("User deleted");
        navigate("/admin/users");
      })
      .catch(() => toast.error("Delete failed"));
  };

  if (!user)
    return (
      <div className="p-6 text-gray-500">Loading user...</div>
    );

  return (
    <div className="p-6 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-indigo-600 hover:underline"
      >
        ← Back to Users
      </button>

      <div className="bg-white rounded-2xl shadow p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {user.email}
          </h2>
          <p className="text-gray-500 text-sm">
            Unique ID: {user.uniqueId}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Username" value={user.username} />
          <Info label="Role" value={user.role} />
        </div>

        {/* Example Issues Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-700 mb-2">
            ⚠ Issues
          </h3>
          <p className="text-sm text-yellow-600">
            No reported issues.
          </p>
        </div>

        <div className="flex justify-end">
          {user.role !== "ADMIN" && (
            <button
              onClick={handleDelete}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default UserDetails;
