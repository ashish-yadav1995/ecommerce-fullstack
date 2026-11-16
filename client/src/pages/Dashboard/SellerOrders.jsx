// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api"; // Aapka axios/api instance

// function SellerOrders() {
//     const navigate = useNavigate();
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // State for active tab: 'all' ya 'recent'
//     const [activeFilter, setActiveFilter] = useState("recent");

//     // Fetch Orders based on active filter
//     useEffect(() => {
//         const fetchOrders = async () => {
//             try {
//                 setLoading(true);
//                 // Toggle endpoint based on active filter button
//                 const endpoint =
//                     activeFilter === "recent"
//                         ? "/seller/recent-orders"
//                         : "/seller/all-orders";

//                 const response = await api.get(endpoint);

//                 // Backend response structure extract karein
//                 const fetchedData = response.data.data || response.data.orders || response.data || [];
//                 setOrders(fetchedData);
//             } catch (error) {
//                 console.error("Error fetching seller orders:", error);
//                 alert(error.response?.data?.message || "Failed to load orders");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchOrders();
//     }, [activeFilter]); // Tab change hone par refetch hoga

//     // Handle Status Update
//     const handleStatusUpdate = async (orderId, newStatus) => {
//         debugger;
//         try {
//             await api.put(`/seller/orders/${orderId}/status`, { orderStatus: newStatus });
//             alert("Order status updated successfully!");

//             setOrders((prev) =>
//                 prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
//             );
//         } catch (error) {
//             console.error("Status update error:", error);
//             alert(error.response?.data?.message || "Failed to update status");
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-50 p-6 font-sans">
//             <div className="max-w-6xl mx-auto">

//                 {/* Back Button */}
//                 <button
//                     onClick={() => navigate("/seller")}
//                     className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
//                 >
//                     ← Back to Dashboard
//                 </button>

//                 {/* Header & Filter Buttons Container */}
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
//                     <div>
//                         <h1 className="text-3xl font-black text-gray-900 tracking-tight">
//                             Seller Orders
//                         </h1>
//                         <p className="text-gray-500 text-sm mt-1">
//                             Manage and track customer purchases for your products
//                         </p>
//                     </div>

//                     {/* TWO FILTER BUTTONS */}
//                     <div className="flex bg-gray-200/70 p-1.5 rounded-2xl w-fit">
//                         <button
//                             onClick={() => setActiveFilter("recent")}
//                             className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeFilter === "recent"
//                                     ? "bg-black text-white shadow-md"
//                                     : "text-gray-600 hover:text-black"
//                                 }`}
//                         >
//                             Recent Orders (Top 10)
//                         </button>
//                         <button
//                             onClick={() => setActiveFilter("all")}
//                             className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeFilter === "all"
//                                     ? "bg-black text-white shadow-md"
//                                     : "text-gray-600 hover:text-black"
//                                 }`}
//                         >
//                             All Orders
//                         </button>
//                     </div>
//                 </div>

//                 {/* Table / Content Section */}
//                 {loading ? (
//                     <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
//                         <p className="font-bold text-gray-500">Loading orders...</p>
//                     </div>
//                 ) : orders.length === 0 ? (
//                     <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
//                         <p className="text-gray-400 font-bold text-sm">
//                             No {activeFilter === "recent" ? "recent" : ""} orders found.
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
//                         <div className="overflow-x-auto">
//                             <table className="w-full text-left border-collapse">
//                                 <thead>
//                                     <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
//                                         <th className="p-5">Order Details</th>
//                                         <th className="p-5">Customer</th>
//                                         <th className="p-5">Items Price</th>
//                                         <th className="p-5">Status</th>
//                                         <th className="p-5 text-right">Update Status</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-100 text-sm">
//                                     {orders.map((order) => (
//                                         <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
//                                             <td className="p-5">
//                                                 <p className="font-black text-gray-900 tracking-tight">{order._id}</p>
//                                                 <p className="text-[11px] text-gray-400 font-medium mt-0.5">
//                                                     {new Date(order.createdAt).toLocaleDateString("en-US", {
//                                                         day: "numeric",
//                                                         month: "short",
//                                                         year: "numeric",
//                                                     })}
//                                                 </p>
//                                             </td>
//                                             <td className="p-5">
//                                                 <p className="font-bold text-gray-800">{order.customer?.name || "Customer"}</p>
//                                                 <p className="text-xs text-gray-400">{order.customer?.email}</p>
//                                             </td>
//                                             <td className="p-5 font-black text-gray-900">
//                                                 ₹{Number(order.itemsPrice || order.totalPrice || 0).toFixed(2)}
//                                             </td>
//                                             <td className="p-5">
//                                                 <span className="px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200">
//                                                     {order.orderStatus || order.status}
//                                                 </span>
//                                             </td>
//                                             <td className="p-5 text-right">
//                                                 <select
//                                                     value={order.orderStatus || order.status}
//                                                     onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
//                                                     className="border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-black bg-white cursor-pointer"
//                                                 >
//                                                     <option value="Pending">Pending</option>
//                                                     <option value="Confirmed">Confirmed</option>
//                                                     <option value="Processing">Processing</option>
//                                                     <option value="Shipped">Shipped</option>
//                                                     <option value="Delivered">Delivered</option>
//                                                     <option value="Cancelled">Cancelled</option>
//                                                 </select>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// }

// export default SellerOrders;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function SellerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("recent");
  
  // State for viewing specific order details in a modal
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
    e.stopPropagation(); // Click event ko row click se bachane ke liye
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
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/seller")}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          ← Back to Dashboard
        </button>

        {/* Header & Filter Buttons Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Seller Orders
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and track customer purchases for your products. Click any order to view items.
            </p>
          </div>

          {/* TWO FILTER BUTTONS */}
          <div className="flex bg-gray-200/70 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveFilter("recent")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeFilter === "recent"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Recent Orders (Top 10)
            </button>
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeFilter === "all"
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              All Orders
            </button>
          </div>
        </div>

        {/* Table / Content Section */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="font-bold text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-gray-400 font-bold text-sm">
              No {activeFilter === "recent" ? "recent" : ""} orders found.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
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
                      onClick={() => setSelectedOrder(order)} // Row click pe order select hoga modal ke liye
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
                        <span className="px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-200">
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
        )}

        {/* ORDER DETAILS MODAL (POPUP) */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Order Details</h2>
                  <p className="text-xs font-bold text-indigo-600 mt-0.5">ID: {selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-gray-100 text-gray-500 hover:bg-black hover:text-white w-9 h-9 rounded-full font-bold flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
                <p className="text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Customer Info</p>
                <p className="font-bold text-gray-800">{selectedOrder.customer?.name}</p>
                <p className="text-xs text-gray-500">{selectedOrder.customer?.email}</p>
                <p className="text-xs text-gray-500 mt-1">Payment Method: <span className="font-semibold">{selectedOrder.paymentMethod || "COD"}</span></p>
              </div>

              {/* Ordered Items List */}
              <div className="mb-6">
                <p className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3">Products in this Order</p>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <img 
                        src={item.product?.images?.[0] || item.image || "https://via.placeholder.com/60"} 
                        alt={item.product?.name || item.name} 
                        className="w-14 h-14 object-cover rounded-xl border border-gray-100"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{item.product?.name || item.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-black text-gray-900 text-sm">₹{item.quantity * item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary */}
              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-500 text-sm">Total Amount</span>
                <span className="text-xl font-black text-gray-900">₹{Number(selectedOrder.itemsPrice || selectedOrder.totalPrice || 0).toFixed(2)}</span>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition"
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