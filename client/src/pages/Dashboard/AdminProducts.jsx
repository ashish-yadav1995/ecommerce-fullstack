import React, { useEffect, useState } from "react";
import { getAllAdminProducts, activateProduct, deactivateProduct } from "../../services/adminApi";
import { useNavigate } from "react-router-dom";
import myimg from "../../assets/images/tshirt.webp";

function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllAdminProducts();
      console.log("Admin Products API Response:", res);
      setProducts(res.products || res.data || res || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStatus = async (e, id, currentStatus) => {
    e.stopPropagation(); // 👈 Button click karne par modal open nahi hoga
    try {
      if (currentStatus) {
        await deactivateProduct(id);
      } else {
        await activateProduct(id);
      }

      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isActive: !currentStatus } : p))
      );
    } catch (error) {
      alert(error.response?.data?.message || "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-6">Manage Products</h1>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found on platform.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div 
                key={p._id} 
                onClick={() => {
                  console.log("Card clicked:", p); // Debugging ke liye
                  setSelectedProduct(p);
                }}
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between cursor-pointer hover:border-black transition"
              >
                <div>
                  <div className="h-40 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden mb-3">
                    <img
                      src={p.images?.[0]?.url || p.images?.[0] || myimg}
                      alt={p.name}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <h4 className="font-bold text-gray-800 line-clamp-1">{p.name}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Seller: {p.seller?.name || "N/A"}</p>
                  <p className="font-black text-lg text-gray-900 mt-2">₹{p.discountPrice || p.price}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.isActive !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    {p.isActive !== false ? "Active" : "Inactive"}
                  </span>
                  <button
                    onClick={(e) => handleToggleStatus(e, p._id, p.isActive !== false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      p.isActive !== false
                        ? "border border-red-500 text-red-600 hover:bg-red-50"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {p.isActive !== false ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white font-bold transition"
            >
              ✕
            </button>

            <div className="h-56 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden mb-4 p-4">
              <img
                src={selectedProduct.images?.[0]?.url || selectedProduct.images?.[0] || myimg}
                alt={selectedProduct.name}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                  {selectedProduct.category?.name || "General"}
                </span>
                <h2 className="text-xl font-black text-gray-900 mt-2">{selectedProduct.name}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Seller: <span className="font-bold text-gray-700">{selectedProduct.seller?.name || "Admin"}</span> ({selectedProduct.seller?.email || "N/A"})
                </p>
              </div>
              <p className="text-2xl font-black text-gray-900">₹{selectedProduct.discountPrice || selectedProduct.price}</p>
            </div>

            <p className="text-sm text-gray-600 mt-4 leading-relaxed max-h-32 overflow-y-auto">
              {selectedProduct.description || "No description provided for this product."}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3.5 rounded-2xl mt-4 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Stock Available</span>
                <span className="font-bold text-gray-800 text-sm">{selectedProduct.stock ?? "N/A"} units</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Platform Status</span>
                <span className={`font-bold text-sm ${selectedProduct.isActive !== false ? "text-green-600" : "text-red-600"}`}>
                  {selectedProduct.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;