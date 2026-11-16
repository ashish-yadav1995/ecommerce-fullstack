// import { useNavigate } from "react-router-dom";

// function SellerHome() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <button
//           onClick={() => navigate("/profile")}
//           className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
//         >
//           ← Back to Profile
//         </button>

//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-black text-gray-900">
//             Seller Dashboard
//           </h1>

//           <p className="text-gray-500 mt-1">
//             Manage your products and store
//           </p>
//         </div>

//         {/* Dashboard Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           {/* Add Product */}
//           <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
//             <div className="text-4xl mb-4">
//               ➕
//             </div>

//             <h2 className="text-xl font-bold">
//               Add Product
//             </h2>

//             <p className="text-gray-500 text-sm mt-2 mb-5">
//               Add a new product to your store.
//             </p>

//             <button
//               onClick={() => navigate("/seller/add-product")}
//               className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
//             >
//               Add Product
//             </button>
//           </div>

//           {/* My Products */}
//           <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
//             <div className="text-4xl mb-4">
//               📦
//             </div>

//             <h2 className="text-xl font-bold">
//               My Products
//             </h2>

//             <p className="text-gray-500 text-sm mt-2 mb-5">
//               View and manage your products.
//             </p>

//             <button
//               onClick={() => navigate("/seller/products")}
//               className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
//             >
//               My Products
//             </button>
//           </div>

//           {/* Orders */}
//           <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
//             <div className="text-4xl mb-4">
//               🛒
//             </div>

//             <h2 className="text-xl font-bold">
//               Orders
//             </h2>

//             <p className="text-gray-500 text-sm mt-2 mb-5">
//               Manage orders for your products.
//             </p>

//             <button
//               onClick={() => navigate("/seller/orders")}
//               className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
//             >
//               View Orders
//             </button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// export default SellerHome;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function SellerHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats on load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/seller/dashboard");
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching seller dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/profile")}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          ← Back to Profile
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Seller Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your products, sales analytics, and store orders
          </p>
        </div>

        {/* STATS OVERVIEW CARDS (from getSellerDashboardStats) */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Revenue</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                ₹{stats.sales?.total?.toFixed(2) || "0.00"}
              </h3>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Products Status</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                {stats.products?.total || 0}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Active: {stats.products?.active} | Inactive: {stats.products?.inactive}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Orders Count</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                {stats.orders?.total || 0}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Delivered: {stats.orders?.delivered} | Pending: {stats.orders?.pending}
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Add Product */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-4xl mb-4">
              ➕
            </div>

            <h2 className="text-xl font-bold">
              Add Product
            </h2>

            <p className="text-gray-500 text-sm mt-2 mb-5">
              Add a new product to your store.
            </p>

            <button
              onClick={() => navigate("/seller/add-product")}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Add Product
            </button>
          </div>

          {/* My Products */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-4xl mb-4">
              📦
            </div>

            <h2 className="text-xl font-bold">
              My Products
            </h2>

            <p className="text-gray-500 text-sm mt-2 mb-5">
              View and manage your products.
            </p>

            <button
              onClick={() => navigate("/seller/products")}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              My Products
            </button>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-4xl mb-4">
              🛒
            </div>

            <h2 className="text-xl font-bold">
              Orders
            </h2>

            <p className="text-gray-500 text-sm mt-2 mb-5">
              Manage orders for your products.
            </p>

            <button
              onClick={() => navigate("/seller/orders")}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              View Orders
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SellerHome;