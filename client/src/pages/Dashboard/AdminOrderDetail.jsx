import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Aapke backend order detail endpoint ke anusar route set karein
        const res = await api.get(`/admin/orders/${id}`);
        setOrder(res.data.order || res.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-red-500">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold mb-6 hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <h1 className="text-xl font-black text-gray-900">Order #{order._id}</h1>
              <p className="text-xs text-gray-400 mt-1">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-bold text-xs uppercase">
              {order.orderStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Customer Info</h3>
              <p className="font-bold text-gray-800">{order.user?.name || "N/A"}</p>
              <p className="text-sm text-gray-600">{order.user?.email || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Payment Status</h3>
              <p className="font-bold text-green-600">{order.paymentStatus || "Paid"}</p>
            </div>
          </div>

          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3">Order Items</h3>
          <div className="divide-y divide-gray-100">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-800">{item.name}</span>
                  <span className="text-xs text-gray-500">x {item.quantity}</span>
                </div>
                <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t mt-6 pt-4 flex justify-between items-center text-lg font-black text-gray-900">
            <span>Total Amount</span>
            <span>₹{order.totalPrice || order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;