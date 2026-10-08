import { useEffect, useState } from "react";
import API from "../../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeListings: 0,
    totalQuantity: 0,
    lowStock: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/products/distributor");
        const products = res.data || [];

        setStats({
          activeListings: products.length,
          totalQuantity: products.reduce(
            (sum, p) => sum + (p.quantity || 0),
            0
          ),
          lowStock: products.filter(p => p.quantity < 10).length,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Distributor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-gray-500">Active Listings</p>
          <h2 className="text-3xl font-bold">
            {stats.activeListings}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-gray-500">Total Stock</p>
          <h2 className="text-3xl font-bold">
            {stats.totalQuantity} kg
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-gray-500">Low Stock</p>
          <h2 className="text-3xl font-bold text-red-600">
            {stats.lowStock}
          </h2>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
