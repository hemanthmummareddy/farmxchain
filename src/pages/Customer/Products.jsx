import { useEffect, useState, useCallback } from "react";
import CustomerLayout from "../../Layouts/CustomerLayout";
import API from "../../api/api";
import ProductCard from "../../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const token = localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await API.get("/products/customer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterType === "All" ||
      p.type
        ?.toLowerCase()
        .startsWith(filterType.toLowerCase().slice(0, -1));

    return matchesSearch && matchesCategory;
  });

  return (
    <CustomerLayout>
      <h1 className="text-3xl font-black mb-6">🛒 Fresh Marketplace</h1>

      <input
        type="text"
        placeholder="Search crops..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-3 rounded w-full"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </CustomerLayout>
  );
};

export default Products;
