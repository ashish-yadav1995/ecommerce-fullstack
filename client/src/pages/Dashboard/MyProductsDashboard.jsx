import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProducts, deleteProduct } from "../../services/productApi";

function MyProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete Handler Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await deleteProduct(id);
        alert(response.message || "Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || error.message || "Failed to delete product");
      }
    }
  };

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await getMyProducts();
        setProducts(response.products || response.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        alert(error.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="font-semibold text-sm">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 w-full overflow-x-hidden font-sans">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate("/seller")}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">My Products</h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Products added by you</p>
          </div>

          <button
            onClick={() => navigate("/seller/add-product")}
            className="w-full sm:w-auto bg-black text-white px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm hover:bg-gray-800 transition text-center"
          >
            + Add Product
          </button>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border p-8 sm:p-10 text-center shadow-sm">
            <p className="text-gray-500 text-xs sm:text-sm mb-4">
              You haven't added any products yet.
            </p>
            <button
              onClick={() => navigate("/seller/add-product")}
              className="bg-black text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between h-full"
              >
                {/* Top Content: Image & Info */}
                <div>
                  {/* Image Container */}
                  <div className="h-48 sm:h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0]?.url || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-gray-400 font-medium text-xs">No Image</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-4 sm:p-5">
                    <h2 className="font-bold text-base sm:text-lg line-clamp-2 h-12 sm:h-14">
                      {product.name}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {product.brand}
                    </p>

                    <p className="font-black text-base sm:text-lg mt-2 sm:mt-3">
                      ₹{product.discountPrice || product.price}
                    </p>

                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="p-4 sm:p-5 pt-0">
                  <div>
                    <button
                      onClick={() =>
                        navigate(`/seller/products/${product._id}`)
                      }
                      className="w-full border border-gray-300 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      View Product
                    </button>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() =>
                        navigate(`/seller/edit-product/${product._id}`)
                      }
                      className="flex-1 bg-black text-white py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-800 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProducts;