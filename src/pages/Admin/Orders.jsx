import { useEffect, useState } from "react";
import API from "../../api/api";
import StatusBadge from "../../components/Admin/StatusBadge";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    API.get("/admin/orders/all")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Failed to load orders", err));
  }, []);

  const getRisk = (order) => {
    if (order.totalPrice > 10000) return "HIGH";
    return "NORMAL";
  };

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">
          Orders Intelligence
        </h1>

        <select
          className="border rounded px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="PLACED">Placed</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Buyer</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((o) => {
              const risk = getRisk(o);

              return (
                <tr
                  key={o.orderId}
                  onClick={() => setSelectedOrder(o)}
                  className="border-b hover:bg-indigo-50 cursor-pointer transition"
                >
                  <td className="p-4 font-semibold">
                    {o.orderId}
                  </td>

                  <td className="p-4">
                    {o.productName}
                  </td>

                  <td className="p-4">
                    {o.buyerUniqueId}
                  </td>

                  <td className="p-4">
                    <StatusBadge value={o.status} />
                  </td>

                  <td className="p-4 font-semibold">
                    ₹{o.totalPrice}
                    {risk === "HIGH" && (
                      <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        High Risk
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No orders found
          </div>
        )}
      </div>

      {/* Side Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
          <div className="w-96 bg-white h-full p-6 shadow-xl">
            <button
              className="mb-4 text-gray-500 hover:text-black"
              onClick={() => setSelectedOrder(null)}
            >
              ✕ Close
            </button>

            <h2 className="text-xl font-black mb-4">
              Order {selectedOrder.orderId}
            </h2>

            <div className="space-y-2 text-sm">
              <p><strong>Product:</strong> {selectedOrder.productName}</p>
              <p><strong>Buyer:</strong> {selectedOrder.buyerUniqueId}</p>
              <p><strong>Farmer:</strong> {selectedOrder.farmerUniqueId}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Quantity:</strong> {selectedOrder.quantity} kg</p>
              <p><strong>Total:</strong> ₹{selectedOrder.totalPrice}</p>
            </div>

            <div className="mt-6 space-y-3">
              <button className="w-full bg-indigo-600 text-white py-2 rounded">
                Review Order
              </button>

              <button className="w-full bg-yellow-500 text-white py-2 rounded">
                Flag Order
              </button>

              <button className="w-full bg-red-600 text-white py-2 rounded">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
