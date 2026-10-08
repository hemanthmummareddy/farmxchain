import React, { useEffect, useState, useCallback } from "react";
import Farmerlayout from "../../Layouts/Farmerlayout";
import API from "../../api/api";

const Mycrops = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCrop, setEditingCrop] = useState(null);

  const fetchMyCrops = useCallback(async () => {
    try {
      const res = await API.get("/products/my");
      setCrops(res.data || []);
    } catch (err) {
      console.error("Error fetching crops", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this crop?")) return;

    try {
      await API.delete(`/products/${id}`);
      setCrops((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("price", editingCrop.price);
    formData.append("quantity", editingCrop.quantity);
    formData.append("targetRole", editingCrop.targetRole);

    try {
      await API.put(`/products/${editingCrop.id}`, formData);
      setEditingCrop(null);
      fetchMyCrops();
    } catch (err) {
      alert(err.response?.data || "Update failed");
    }
  };

  useEffect(() => {
    fetchMyCrops();
  }, [fetchMyCrops]);

  return (
    <Farmerlayout>
      <h1 className="text-2xl font-black mb-8">My Warehouse</h1>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {crops.map((crop) => (
          <div key={crop.id} className="bg-white rounded-2xl shadow border">
            {crop.imageUrls?.[0] && (
              <img
                src={crop.imageUrls[0]}
                alt={crop.name}
                className="h-40 w-full object-cover rounded-t-2xl"
              />
            )}

            <div className="p-4">
              <h3 className="font-bold">{crop.name}</h3>
              <p className="text-green-600 font-bold">₹{crop.price}/kg</p>
              <p className="text-sm text-gray-500">Stock: {crop.quantity} kg</p>
              <p className="text-sm">Sell To: <b>{crop.targetRole}</b></p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setEditingCrop(crop)}
                  className="flex-1 bg-gray-100 py-2 rounded-lg font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(crop.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingCrop && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-2xl w-full max-w-md"
          >
            <h2 className="font-bold mb-4">Edit {editingCrop.name}</h2>

            <input
              type="number"
              value={editingCrop.price}
              onChange={(e) =>
                setEditingCrop({ ...editingCrop, price: e.target.value })
              }
              className="w-full p-3 border rounded mb-3"
            />

            <input
              type="number"
              value={editingCrop.quantity}
              onChange={(e) =>
                setEditingCrop({ ...editingCrop, quantity: e.target.value })
              }
              className="w-full p-3 border rounded mb-3"
            />

            <select
              value={editingCrop.targetRole}
              onChange={(e) =>
                setEditingCrop({ ...editingCrop, targetRole: e.target.value })
              }
              className="w-full p-3 border rounded mb-4"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="DISTRIBUTOR">Distributor</option>
            </select>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditingCrop(null)}
                className="flex-1 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-green-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </Farmerlayout>
  );
};

export default Mycrops;
