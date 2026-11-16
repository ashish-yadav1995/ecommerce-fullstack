import React, { useEffect, useState } from "react";
import { getAdminDashboardStats, getAdminRecentOrders } from "../../services/adminApi";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const statsRes = await getAdminDashboardStats();
        console.log("Dashboard Stats:", statsRes); // Console mein check karne ke liye
        setStats(statsRes.data?.stats || statsRes.stats || statsRes.data || statsRes);

        const ordersRes = await getAdminRecentOrders();
        setRecentOrders(ordersRes.orders || ordersRes.data || []);
      } catch (error) {
        console.error("Failed to load admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-gray-500">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Header & Navigation Actions */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Platform overview and management console</p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition"
            >
              Manage Users
            </button>
            <button
              onClick={() => navigate("/admin/products")}
              className="border border-gray-300 bg-white text-gray-800 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
            >
              Manage Products
            </button>
            <button
              onClick={() => navigate("/admin/reviews")}
              className="border border-gray-300 bg-white text-gray-800 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition"
            >
              Manage Reviews
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

            {/* 1. Total Users Card */}
            <div
              onClick={() => navigate("/admin/users")}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:border-black transition transform hover:-translate-y-1"
            >
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Users</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">{stats.totalUsers || 0}</h3>
              <p className="text-[11px] text-indigo-600 font-bold mt-2">Manage Users →</p>
            </div>

            {/* 2. Total Products Card */}
            <div
              onClick={() => navigate("/admin/products")}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:border-black transition transform hover:-translate-y-1"
            >
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Products</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">{stats.totalProducts || 0}</h3>
              <p className="text-[11px] text-indigo-600 font-bold mt-2">Manage Products →</p>
            </div>

            {/* 3. Total Orders Card */}
            <div
              onClick={() => navigate("/admin")} // Ya agar aapka koi dedicated orders page ho jaise "/admin/orders"
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm cursor-pointer hover:border-black transition transform hover:-translate-y-1"
            >
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Orders</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">{stats.totalOrders || 0}</h3>
              <p className="text-[11px] text-indigo-600 font-bold mt-2">View Orders Below ↓</p>
            </div>

            {/* 4. Total Revenue Card */}
            <div
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm cursor-default"
            >
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2">₹{stats.totalRevenue || 0}</h3>
              <p className="text-[11px] text-green-600 font-bold mt-2">Verified Earnings</p>
            </div>

          </div>
        )}

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-black text-gray-900 mb-4">Recent Platform Orders</h2>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No recent orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/admin/orders/${order._id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="py-3 font-mono text-xs text-indigo-600 font-bold">{order._id}</td>
                      <td className="py-3 font-bold text-gray-800">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-gray-600">{order.paymentStatus}</td>
                      <td className="py-3 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminHome;