import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function SellerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("recent");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch Orders based on active filter
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const endpoint =
          activeFilter === "recent"
            ? "/seller/recent-orders"
            : "/seller/all-orders";

        const response = await api.get(endpoint);
        const fetchedData = response.data.data || response.data.orders || response.data || [];
        setOrders(fetchedData);
      } catch (error) {
        console.error("Error fetching seller orders:", error);
        alert(error.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeFilter]);

  // Handle Status Update
  const handleStatusUpdate = async (orderId, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/seller/orders/${orderId}/status`, { orderStatus: newStatus });
      alert("Order status updated successfully!");

      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/seller")}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          ← Back to Dashboard
        </button>

        {/* Header & Filter Buttons Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Seller Orders
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">
              Manage and track customer purchases for your products. Click any order to view items.
            </p>
          </div>

          {/* TWO FILTER BUTTONS */}
          <div className="flex bg-gray-200/70 p-1.5 rounded-2xl w-full sm:w-fit">
            <button
              onClick={() => setActiveFilter("recent")}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all ${activeFilter === "recent"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:text-black"
                }`}
            >
              Recent (Top 10)
            </button>
            <button
              onClick={() => setActiveFilter("all")}
              className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-wider transition-all ${activeFilter === "all"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:text-black"
                }`}
            >
              All Orders
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="bg-white rounded-3xl p-10 sm:p-12 text-center border border-gray-100 shadow-sm">
            <p className="font-bold text-gray-500 text-sm">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-12 text-center shadow-sm">
            <p className="text-gray-400 font-bold text-xs sm:text-sm">
              No {activeFilter === "recent" ? "recent" : ""} orders found.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP / TABLET TABLE VIEW (Hidden on mobile) */}
            <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="p-5">Order Details</th>
                      <th className="p-5">Customer</th>
                      <th className="p-5">Items Price</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                      >
                        <td className="p-5">
                          <p className="font-black text-indigo-600 hover:underline tracking-tight">
                            {order._id}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </td>
                        <td className="p-5">
                          <p className="font-bold text-gray-800">{order.customer?.name || "Customer"}</p>
                          <p className="text-xs text-gray-400">{order.customer?.email}</p>
                        </td>
                        <td className="p-5 font-black text-gray-900">
                          ₹{Number(order.itemsPrice || order.totalPrice || 0).toFixed(2)}
                        </td>
                        <td className="p-5">
                          <span className="px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200 inline-block">
                            {order.orderStatus || order.status}
                          </span>
                        </td>
                        <td className="p-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={order.orderStatus || order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value, e)}
                            className="border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black bg-white cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARD VIEW (Visible only on mobile screens < md) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm cursor-pointer active:scale-[0.99] transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Order ID</p>
                      <p className="font-black text-indigo-600 text-xs truncate max-w-[190px]">{order._id}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200">
                      {order.orderStatus || order.status}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mb-3 text-xs space-y-1">
                    <p className="text-gray-800 font-bold">{order.customer?.name || "Customer"}</p>
                    <p className="text-gray-400 truncate">{order.customer?.email}</p>
                    <p className="text-gray-400 text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Amount</p>
                      <p className="font-black text-gray-900 text-sm">
                        ₹{Number(order.itemsPrice || order.totalPrice || 0).toFixed(2)}
                      </p>
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.orderStatus || order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value, e)}
                        className="border border-gray-300 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none bg-white cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ORDER DETAILS MODAL */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-5 sm:mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-gray-900">Order Details</h2>
                  <p className="text-[11px] sm:text-xs font-bold text-indigo-600 mt-0.5 truncate max-w-[220px] sm:max-w-none">ID: {selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-gray-100 text-gray-500 hover:bg-black hover:text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full font-bold flex items-center justify-center transition-all shrink-0"
                >
                  ✕
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-2xl mb-5 sm:mb-6 border border-gray-100 text-xs">
                <p className="font-black uppercase text-gray-400 tracking-wider mb-1">Customer Info</p>
                <p className="font-bold text-gray-800 text-sm">{selectedOrder.customer?.name}</p>
                <p className="text-gray-500 break-all">{selectedOrder.customer?.email}</p>
                <p className="text-gray-500 mt-1">Payment Method: <span className="font-semibold">{selectedOrder.paymentMethod || "COD"}</span></p>
              </div>

              {/* Ordered Items List */}
              <div className="mb-5 sm:mb-6">
                <p className="text-[10px] sm:text-xs font-black uppercase text-gray-400 tracking-wider mb-3">Products in this Order</p>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 sm:gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <img
                        src={item.product?.images?.[0] || item.image || "https://via.placeholder.com/60"}
                        alt={item.product?.name || item.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">{item.product?.name || item.name}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-black text-gray-900 text-xs sm:text-sm shrink-0">₹{item.quantity * item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
                <span className="font-bold text-gray-500">Total Amount</span>
                <span className="text-lg sm:text-xl font-black text-gray-900">₹{Number(selectedOrder.itemsPrice || selectedOrder.totalPrice || 0).toFixed(2)}</span>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-black text-white py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default SellerOrders;