import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Farmerlayout from "../../Layouts/Farmerlayout";
import Statcard from "../../components/Statcard";
import API from "../../api/api";
import SmartAdvisor from "./SmartAdvisor";
import { useCountUp } from "../../hooks/useCountUp";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeCrops: 0,
    ordersToday: 0,
    lowStock: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/farmer/dashboard");
        console.log("FARMER DASHBOARD:", res.data); // 👈 verify once

        setStats({
          totalSales: res.data.totalSales || 0,
          activeCrops: res.data.activeCrops || 0,
          ordersToday: res.data.ordersToday || 0,
          lowStock: res.data.lowStock || 0,
        });
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const totalSales = useCountUp(loading ? 0 : stats.totalSales);
  const activeCrops = useCountUp(loading ? 0 : stats.activeCrops);
  const ordersToday = useCountUp(loading ? 0 : stats.ordersToday);
  const lowStock = useCountUp(loading ? 0 : stats.lowStock);

  return (
    <Farmerlayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Welcome, Farmer 👨‍🌾
        </h1>
        <p className="text-gray-500 text-sm">
          Account:{" "}
          <span className="ml-1 text-green-600 font-bold uppercase text-[10px]">
            Active
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Statcard title="Total Sales" value={`₹${totalSales}`} icon="💰" />
          <Statcard title="Active Crops" value={activeCrops} icon="🌾" />
          <Statcard title="Orders Today" value={ordersToday} icon="📦" />
          <Statcard title="Low Stock Alert" value={lowStock} icon="⚠️" />
        </div>

        <SmartAdvisor />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/farmer/add-crop" className="dashboard-card">
          ➕ Add New Crop
        </Link>
        <Link to="/farmer/my-crops" className="dashboard-card">
          🌾 My Warehouse
        </Link>
        <Link to="/farmer/orders" className="dashboard-card">
          📦 Manage Orders
        </Link>
      </div>
    </Farmerlayout>
  );
};

export default Dashboard;
