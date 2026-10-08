import { useEffect, useState } from "react";
import API from "../../api/api";

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState("");

  useEffect(() => {
    API.get("/products/distributor")
      .then(res => setProducts(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const openCart = (product) => {
    setSelected(product);
    setQty(1);
  };

  const closeCart = () => setSelected(null);

 const confirmOrder = async () => {
  try {
    await API.post(
        "/orders/create",
        { productId: selected.id, quantity: qty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        
    });

    setToast("✅ Order placed successfully");
    setSelected(null);
    setTimeout(() => setToast(""), 3000);
  } catch (err) {
    console.error(err);
    alert(err.response?.data || "Order failed");
  }
};


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>

      {toast && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
          {toast}
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(p => {
            const finalPrice =
              p.discount > 0
                ? Math.round(p.price - (p.price * p.discount) / 100)
                : p.price;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border shadow hover:shadow-lg transition p-5 flex flex-col"
              >
                {/* Image */}
                <img
                  src={p.imageUrls?.[0] || "/placeholder.png"}
                  alt={p.name}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />

                <h3 className="font-bold text-lg">{p.name}</h3>

                <p className="text-sm text-gray-500">
                  Category: {p.type}
                </p>

                <p className="text-sm text-gray-500">
                  Harvested on: {p.harvestDate}
                </p>

                <div className="mt-2">
                  {p.discount > 0 && (
                    <span className="text-sm line-through text-gray-400 mr-2">
                      ₹{p.price}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-indigo-600">
                    ₹{finalPrice}
                  </span>
                  <span className="text-sm text-gray-500"> / kg</span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  Available: {p.quantity} kg
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Supplier: <b>{p.farmerUniqueId}</b>
                </p>

                <button
                  onClick={() => openCart(p)}
                  className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold"
                >
                  Buy Now
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 🛒 CART MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex gap-4">
              <img
                src={selected.imageUrls?.[0] || "/placeholder.png"}
                className="h-28 w-28 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold">
                  Buy {selected.name}
                </h2>
                <p className="text-sm text-gray-500">
                  ₹{selected.price} / kg · {selected.quantity} kg available
                </p>
                <p className="text-sm text-gray-500">
                  Farmer: {selected.farmerUniqueId}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold">
                Quantity (kg)
              </label>
              <input
                type="number"
                min="1"
                max={selected.quantity}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="mt-1 w-full border rounded-lg p-2"
              />
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-2xl font-bold">
                ₹{qty * selected.price}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeCart}
                className="flex-1 py-2 rounded-xl border font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmOrder}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
