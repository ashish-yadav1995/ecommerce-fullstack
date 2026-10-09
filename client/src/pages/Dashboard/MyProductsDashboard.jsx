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
        alert(response.message);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await getMyProducts();
        setProducts(response.products || []);
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-semibold">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black">My Products</h1>
            <p className="text-gray-500 mt-1">Products added by you</p>
          </div>

          <button
            onClick={() => navigate("/seller/add-product")}
            className="bg-black text-white px-5 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            + Add Product
          </button>
        </div>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <p className="text-gray-500 mb-4">
              You haven't added any products yet.
            </p>
            <button
              onClick={() => navigate("/seller/add-product")}
              className="bg-black text-white px-5 py-3 rounded-xl"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          /* Grid with items-start to prevent height distortion */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between h-full"
              >
                {/* Top Content: Image & Info */}
                <div>
                  {/* Image Container */}
                  <div className="h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {product.images?.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-gray-400 font-medium">No Image</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    {/* Fixed 2 lines for Product Title */}
                    <h2 className="font-bold text-lg line-clamp-2 h-14">
                      {product.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {product.brand}
                    </p>

                    <p className="font-bold text-lg mt-3">
                      ₹{product.discountPrice || product.price}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Buttons (Always aligned at the bottom) */}
                <div className="p-5 pt-0">
                  <div>
                    <button
                      onClick={() =>
                        navigate(`/productdetail?id=${product._id}`)
                      }
                      className="w-full border border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      View Product
                    </button>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() =>
                        navigate(`/seller/edit-product/${product._id}`)
                      }
                      className="flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
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
