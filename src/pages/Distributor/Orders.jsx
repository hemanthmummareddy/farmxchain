import { useEffect, useState } from "react";
import API from "../../api/api";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/distributor");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Distributor orders fetch failed", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-2">
        📦 Distributor Orders
      </h1>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
          No orders yet
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => (
            <div
              key={o.orderId}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition"
            >
              <div className="p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    {o.productName}
                  </h2>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      Quantity: <b>{o.quantity} kg</b>
                    </p>
                    <p>
                      Total Price:{" "}
                      <b className="text-green-600">
                        ₹{o.totalPrice}
                      </b>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                    statusColors[o.status] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {o.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
