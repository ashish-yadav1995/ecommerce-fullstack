import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { deleteProduct } from "../../services/productApi";

function SellerProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/seller/products/${id}`);
        const productData = response.data.product || response.data.data || response.data;
        setProduct(productData);
        if (productData?.images?.length > 0) {
          setSelectedImage(productData.images[0]?.url || productData.images[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        alert(error.response?.data?.message || "Product not found");
        navigate("/seller/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await deleteProduct(id);
        alert(response.message || "Product deleted successfully!");
        navigate("/seller/products");
      } catch (error) {
        alert(error.response?.data?.message || error.message || "Delete failed");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="font-bold text-gray-500 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto">

        {/* Top Navigation & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate("/seller/products")}
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            ← Back to My Products
          </button>

          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/seller/edit-product/${product._id}`)}
              className="flex-1 sm:flex-none bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition text-center"
            >
              Edit Product
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 sm:flex-none border border-red-500 text-red-600 bg-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50 transition text-center"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          {/* Left: Product Images */}
          <div>
            <div className="h-64 sm:h-80 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 p-4">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-gray-400 font-semibold text-xs sm:text-sm">No Image Available</span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => {
                  const imgUrl = img?.url || img;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 p-1 bg-gray-50 ${selectedImage === imgUrl ? "border-black" : "border-transparent"
                        }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Status & Category Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${product.isActive !== false
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {product.isActive !== false ? "Active" : "Inactive"}
                </span>
                {product.category && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600">
                    {product.category?.name || product.category}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>

              {product.brand && (
                <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
                  Brand: <span className="text-gray-800">{product.brand}</span>
                </p>
              )}

              {/* Pricing */}
              <div className="mt-4 sm:mt-5 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">
                  ₹{product.discountPrice || product.price}
                </span>
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="text-sm sm:text-base text-gray-400 line-through font-semibold">
                    ₹{product.price}
                  </span>
                )}
              </div>

              {/* Stock Info */}
              <div className="mt-4 p-3.5 sm:p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center text-xs sm:text-sm">
                <span className="font-black uppercase text-gray-400 tracking-wider">
                  Available Stock
                </span>
                <span
                  className={`font-black ${product.stock > 5 ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {product.stock} Units
                </span>
              </div>

              {/* Description */}
              <div className="mt-5 sm:mt-6">
                <h3 className="text-[10px] sm:text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Product ID Footer */}
            <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100 text-[11px] sm:text-xs text-gray-400 break-all">
              Product ID: <span className="font-mono">{product._id}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SellerProductDetail;