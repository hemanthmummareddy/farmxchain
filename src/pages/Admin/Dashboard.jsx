import { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../services/AdminService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    farmers: 0,
    distributors: 0,
    customers: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchAdminUsers();
        const users = res.data || [];

        setStats({
          total: users.length,
          farmers: users.filter(u => u.role === "FARMER").length,
          distributors: users.filter(u => u.role === "DISTRIBUTOR").length,
          customers: users.filter(u => u.role === "CUSTOMER").length,
        });
      } catch (err) {
        console.error("Admin dashboard error:", err);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.total} />
        <StatCard title="Farmers" value={stats.farmers} />
        <StatCard title="Distributors" value={stats.distributors} />
        <StatCard title="Customers" value={stats.customers} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;
