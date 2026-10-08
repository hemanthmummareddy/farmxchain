import { useEffect, useState, useCallback } from "react";
import Farmerlayout from "../../Layouts/Farmerlayout";
import API from "../../api/api";
import { toast } from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await API.get("/orders/farmer"); // ✅ CORRECT
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data || "Action failed");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Farmerlayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-black mb-8">📦 Orders Received</h1>

        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <div key={o.orderId} className="bg-white p-6 rounded-2xl border">
                <h2 className="font-bold text-lg">{o.productName}</h2>
                <p>Quantity: {o.quantity} kg</p>
                <p className="text-green-600 font-black">₹{o.totalPrice}</p>
                <p className="text-sm">Customer: {o.customerEmail}</p>
                <p>Status: {o.status}</p>

                {o.status === "PENDING" && (
                  <button
                    onClick={() => updateStatus(o.orderId, "ACCEPTED")}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Accept
                  </button>
                )}

                {o.status === "ACCEPTED" && (
                  <button
                    onClick={() => updateStatus(o.orderId, "DELIVERED")}
                    className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Deliver
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Farmerlayout>
  );
};

export default Orders;
