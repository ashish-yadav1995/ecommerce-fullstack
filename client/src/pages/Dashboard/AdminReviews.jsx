import React, { useEffect, useState } from "react";
import { getAllAdminReviews, deleteAdminReview } from "../../services/adminApi";
import { useNavigate } from "react-router-dom";

function AdminReviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getAllAdminReviews();
      setReviews(res.data || res.reviews || res || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteAdminReview(id);
      setReviews((prev) => prev.filter((rev) => rev._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="font-bold text-gray-500 text-sm">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Manage Reviews</h1>
          <span className="bg-white border border-gray-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-600">
            Total: {reviews.length}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 text-center shadow-sm">
            <p className="text-gray-500 text-xs sm:text-sm font-medium">No reviews found on the platform yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-300 transition"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-gray-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                      {rev.user?.name || "Anonymous User"}
                    </span>
                    <span className="text-[11px] text-gray-400 truncate max-w-[150px] sm:max-w-none">
                      ({rev.user?.email || "No email"})
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gray-400">
                      • {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-500 text-xs sm:text-sm font-bold">
                    {"★".repeat(Math.round(rev.rating || 0))}
                    {"☆".repeat(5 - Math.round(rev.rating || 0))}
                    <span className="text-xs text-gray-500 ml-1.5">({rev.rating}/5)</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-gray-700 mt-2 bg-gray-50 p-3.5 rounded-xl border border-gray-100 break-words">
                    "{rev.comment || rev.review || "No comment text"}"
                  </p>

                  {/* Product Name */}
                  <p className="text-xs text-gray-500 pt-1 truncate">
                    Product:{" "}
                    <span className="font-bold text-indigo-600">
                      {rev.product?.name || "Deleted Product"}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteReview(rev._id)}
                  className="w-full md:w-auto bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition text-center whitespace-nowrap"
                >
                  Delete Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;