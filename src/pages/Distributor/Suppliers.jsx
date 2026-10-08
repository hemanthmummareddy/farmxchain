import React, { useEffect, useState } from "react";
import API from "../../api/api";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    API.get("/products/distributor")
      .then((res) => {
        const products = res.data || [];

        const grouped = {};
        products.forEach((p) => {
          if (!grouped[p.farmerUniqueId]) {
            grouped[p.farmerUniqueId] = {
              farmerId: p.farmerUniqueId,
              products: [],
              totalStock: 0,
            };
          }
          grouped[p.farmerUniqueId].products.push(p);
          grouped[p.farmerUniqueId].totalStock += p.quantity;
        });

        setSuppliers(Object.values(grouped));
      })
      .catch(() => setSuppliers([]));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black mb-8">👨‍🌾 Suppliers</h1>

      {suppliers.length === 0 ? (
        <p className="text-gray-500">No suppliers found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {suppliers.map((s) => (
            <div
              key={s.farmerId}
              className="bg-white rounded-2xl border shadow hover:shadow-lg transition p-6"
            >
              <h2 className="font-bold text-lg mb-2">
                Farmer ID: <span className="text-indigo-600">{s.farmerId}</span>
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                Total Stock: <b>{s.totalStock} kg</b>
              </p>

              <div className="space-y-3">
                {s.products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 border rounded-xl p-3"
                  >
                    <img
                      src={p.imageUrls?.[0] || "/placeholder.png"}
                      alt={p.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-gray-500">
                        {p.type} • {p.quantity} kg
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        ₹{p.price}/kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Suppliers;
