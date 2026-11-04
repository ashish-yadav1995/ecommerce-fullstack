import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishlistContext";
import Loader from "../components/Loader";
import { getProductById } from "../services/productApi";
import { useReview } from "../context/ReviewContext";
import { useAuth } from "../context/AuthContext";


function ProductDetail() {
  const { id: paramId } = useParams(); // Safe URL Param fallback
  const location = useLocation();
  const { handleAddToCart } = useCart();
  const { wishlistItems, addItem, removeItem, clearAll, isInWishlist } = useWishList();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const { reviews, totalReviews, averageRating, handleGetSinglegProductReviews, handleUpdateReviews, handleDeleteReviews } = useReview();
  const { user } = useAuth();
  const [isEditReviewOpen, setIsEditReviewOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const id = location.state?.id || paramId;

  // Check karein ki current product wishlist me pehle se hai ya nahi
    const isWishlisted = product?._id ? isInWishlist(product._id) : false;

    console.log("wishlistItems form productdetail",wishlistItems)


  // Heart Icon Click Handler
  const handleWishlistClick = (e) => {
    // e.preventDefault(); // Link click trigger hone se rokne ke liye
    // e.stopPropagation(); // Event bubbling rokne ke liye

    if (isWishlisted) {
      removeItem(product._id)
    } else {
      addItem(product._id)
    }
  };


  useEffect(() => {
    if (id) {
      getProductDetail();
      handleGetSinglegProductReviews(id);
    } else {
      setError("Product ID not found.");
      setLoading(false);
    }
  }, [id]);

  const getProductDetail = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      // Backend response handle karna
      setProduct(data.product || data);
    } catch (error) {
      setError(error.message || "Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };



  const EditReview = (reviewData) => {
    setSelectedReview(reviewData);
    setIsEditReviewOpen(true); // Yahan state true hoti hai toh modal khul jata hai
  };

  // --- DELETE REVIEW FUNCTION ---
  const DeleteReview = async (reviewId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this review?");
      if (!confirmDelete) return;

      const success = await handleDeleteReviews(reviewId);

    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  if (loading) return <Loader />;
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-600">{error || "Product not found"}</p>
      </div>
    );
  }

  // Calculate Discount Percentage safely
  const discountPercent =
    product.discountPrice && product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* --- LEFT SIDE: IMAGE GALLERY --- */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-2xl p-8 flex justify-center overflow-hidden">
            <img
              src={product.images?.[selectedImage] || "https://via.placeholder.com/400"}
              alt={product.name || "Product Image"}
              className="hover:scale-110 transition-transform duration-500 w-full h-[400px] object-contain"
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border rounded-lg p-2 cursor-pointer hover:border-black transition ${selectedImage === index ? "border-black border-2" : "border-gray-200"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: PRODUCT INFO --- */}
        <div className="flex flex-col">
          <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mb-2">
            {product.brand || "Brand"}
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Rating & Stock Badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {averageRating ? averageRating.toFixed(1) : "0.0"} ★
            </div>
            <span className="text-gray-500 text-sm font-medium">|</span>
            <span
              className={`text-sm font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
            >
              {product.stock > 0 ? `In Stock (${product.stock} items left)` : "Out of Stock"}
            </span>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed italic border-l-4 border-gray-200 pl-4">
            "{product.description}"
          </p>

          {/* Pricing Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-gray-900">
                ₹ {(product.discountPrice || product.price)?.toLocaleString("en-IN")}
              </span>
              {discountPercent > 0 && (
                <span className="text-lg text-red-500 font-semibold bg-red-50 px-2 rounded">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                MRP: ₹ {product.price?.toLocaleString("en-IN")}
              </span>
            )}
            <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-10">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock <= 0}
              className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition active:scale-95 shadow-lg"
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            {wishlistItems?.some((item) => item.product?._id === product._id) ? (
              <button
                className="px-6 py-4 border-2 border-red-200 rounded-xl bg-red-50 text-red-500 transition"
                onClick={() => removeItem(product._id)}
              >
                ❤️
              </button>
            ) : (
              <button
                className="px-6 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition"
                onClick={() => handleWishlistClick(product)}
              >
                ♡
              </button>
            )}

            {/* <button
              onClick={handleWishlistClick}
              type="button"
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white backdrop-blur-md shadow-md hover:scale-110 hover:bg-red-50 transition-all group"
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <svg
                className={`w-6 h-6 transition-all duration-300 ${isWishlisted
                  ? "fill-red-500 stroke-red-500 scale-105"
                  : "fill-none stroke-gray-500 group-hover:stroke-red-500"
                  }`}
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button> */}
          </div>

          {/* Additional Specs Table */}
          <div className="grid grid-cols-2 gap-4 text-sm border-t pt-8">
            <div className="text-gray-500">
              Category:{" "}
              <span className="text-black font-medium">
                {product.category?.name || "N/A"}
              </span>
            </div>
            <div className="text-gray-500">
              SKU: <span className="text-black font-medium">{product.sku || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: REVIEWS --- */}
      <div className="mt-20 border-t pt-10">
        <h2 className="text-3xl font-bold mb-6">
          Customer Stories ({totalReviews || 0})
        </h2>

        {/* Fix 2: Safe Reviews Mapping (Handling Array vs Number) */}
        {Array.isArray(reviews) && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-100 transition hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-gray-900">{rev.user.name || "Customer"}</p>
                    <p className="text-xs text-gray-400">
                      {rev.date ? new Date(rev.createdAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <div className="text-yellow-500 font-bold">
                    {"★".repeat(rev.rating || 5)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic leading-snug">
                  "{rev.comment}"
                </p>
                {rev?.user?._id === user?.id && (
                  <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-200">

                    <button
                      onClick={() => EditReview(rev)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-semibold text-blue-600 bg-blue-50
                      hover:bg-blue-100 transition-all duration-200"
                    >
                      <i className="ri-edit-line"></i>
                      Edit
                    </button>

                    <button
                      onClick={() => DeleteReview(rev._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-semibold text-red-600 bg-red-50
                      hover:bg-red-100 transition-all duration-200"
                    >
                      <i className="ri-delete-bin-line"></i>
                      Delete
                    </button>

                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl inline-block text-gray-500 italic">
            No detailed reviews written yet. Average Rating:{" "}
            <span className="font-bold text-gray-800">
              {averageRating ? averageRating.toFixed(1) : "0.0"} ★
            </span>
          </div>
        )}
      </div>

      <EditReviewModal
        isOpen={isEditReviewOpen}
        onClose={() => setIsEditReviewOpen(false)}
        review={selectedReview}
        handleUpdateReviews={handleUpdateReviews}
      />
    </div>


  );
}


const EditReviewModal = ({ isOpen, onClose, review, handleUpdateReviews }) => {
  // Local state for form inputs
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Jab bhi modal khule ya review data change ho, purana data fields me pre-fill kar do
  useEffect(() => {
    if (review) {
      setRating(review.rating || 5);
      setComment(review.comment || "");
    }
  }, [review]);


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating review with ID:", review._id, "Rating:", rating, "Comment:", comment);
      await handleUpdateReviews(review._id, { rating, comment });
      onClose();
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md relative shadow-2xl">

        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Review</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Rating Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
              <option value={4}>⭐⭐⭐⭐ (4/5)</option>
              <option value={3}>⭐⭐⭐ (3/5)</option>
              <option value={2}>⭐⭐ (2/5)</option>
              <option value={1}>⭐ (1/5)</option>
            </select>
          </div>

          {/* Comment Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Write your review here..."
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Close (X) Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
        >
          ✕
        </button>

      </div>
    </div>
  );
};


export default ProductDetail;

