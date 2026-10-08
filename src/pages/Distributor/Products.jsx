import { useEffect, useState, useCallback } from "react";
import DistributorLayout from "../../Layouts/Distributorlayout";
import API from "../../api/api";
import ProductCard from "../../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const token = localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products/distributor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Distributor products error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterType === "All" ||
      p.type
        ?.toLowerCase()
        .startsWith(filterType.toLowerCase().slice(0, -1));

    return matchesSearch && matchesCategory;
  });

  return (
    <DistributorLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          🚚 Distributor Marketplace
        </h1>
        <p className="text-sm text-gray-500">
          Crops available for bulk purchase from farmers
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search crops..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 w-full px-4 py-3 rounded-xl border"
      />

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["All", "Vegetables", "Fruits", "Grains"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold border ${
              filterType === cat
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border">
          <p className="text-gray-500">
            No crops available for distributors right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </DistributorLayout>
  );
};

export default Products;
