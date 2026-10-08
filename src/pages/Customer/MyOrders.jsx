import { useEffect, useState } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import API from "../../api/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/customer");

        // ✅ GUARANTEE ARRAY
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error("Customer orders fetch failed", err);
        setError("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-black mb-8">📦 My Orders</h1>

        {loading && <p className="text-gray-500">Loading orders...</p>}

        {!loading && error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {!loading && orders.length === 0 && !error && (
          <div className="bg-white p-10 rounded-2xl border text-center">
            <p className="text-gray-500 text-lg">
              You haven’t placed any orders yet.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o.orderId}
              className="bg-white rounded-2xl border shadow-sm p-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">
                  {o.productName}
                </h2>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                  {o.status}
                </span>
              </div>

              <div className="mt-3 grid md:grid-cols-3 gap-4 text-sm">
                <p>
                  Quantity: <b>{o.quantity} kg</b>
                </p>
                <p>
                  Total:{" "}
                  <b className="text-green-600">
                    ₹{o.totalPrice}
                  </b>
                </p>
                <p className="text-gray-500">
                  Ordered on{" "}
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Orders;
