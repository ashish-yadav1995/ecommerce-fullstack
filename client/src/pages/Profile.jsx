import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddEditAddressModal from "../components/AddEditAddressModal";
import { useOrder } from "../context/OrderContext";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, setUser, addresses, handleDeleteAddress, handleSetDefaultAddress } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();
  const { handleGetMyOrders, orders } = useOrder();

  const [userData, setUserData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: addresses.filter((addr) => addr?.fullName === user?.name)[0]?.mobile || "",
    role: user?.role || "customer",
    joinDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
      : "April 2026",
  });

  useEffect(() => {
    if (addresses.length > 0 && user) {
      const userAddress = addresses.filter((addr) => addr?.fullName === user?.name);
      setUserData((prevData) => ({
        ...prevData,
        phone: userAddress[0]?.mobile || "",
      }));
    }
  }, [addresses, user]);

  const handleEditClick = (address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans w-full overflow-x-hidden">
      {/* --- PREMIUM BLACK HEADER --- */}
      <div className="bg-black text-white pt-12 pb-24 sm:pt-16 sm:pb-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase italic">
              My Account
            </h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm font-medium tracking-wide">
              Manage your profile, addresses and orders
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">
              Member Since
            </p>
            <p className="text-xs sm:text-sm font-bold tracking-tight">
              {userData.joinDate}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full -mt-12 sm:-mt-16 px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* --- LEFT SIDEBAR: PROFILE CARD --- */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 lg:sticky lg:top-10">
              <div className="flex flex-col items-center text-center">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-black rounded-full flex items-center justify-center text-3xl sm:text-4xl font-black text-white border-6 sm:border-8 border-gray-50 shadow-xl transition-transform group-hover:scale-105">
                    {userData.fullName?.charAt(0) || "U"}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-white p-2 sm:p-2.5 rounded-full shadow-lg border border-gray-100">
                    <span className="text-xs">📷</span>
                  </div>
                </div>
                <h2 className="mt-4 sm:mt-6 text-lg sm:text-xl font-black text-black tracking-tight">
                  {userData.fullName || "User Name"}
                </h2>
                <span
                  className={`mt-2 px-3 sm:px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${userData.role === "admin"
                      ? "bg-red-50 text-red-500 border border-red-100"
                      : "bg-black text-white"
                    }`}
                >
                  {userData.role}
                </span>
              </div>

              <nav className="mt-8 sm:mt-12 space-y-2">
                <SidebarBtn
                  icon="👤"
                  label="Profile Info"
                  onClick={() => setActiveTab("profile")}
                  active={activeTab === "profile"}
                />
                <SidebarBtn
                  icon="📍"
                  label="Saved Addresses"
                  onClick={() => setActiveTab("addresses")}
                  active={activeTab === "addresses"}
                />
                <SidebarBtn
                  icon="📦"
                  label="My Orders"
                  onClick={() => setActiveTab("orders")}
                  active={activeTab === "orders"}
                />

                {userData.role === "seller" && (
                  <SidebarBtn
                    icon="📊"
                    label="Seller Dashboard"
                    onClick={() => navigate("/seller")}
                  />
                )}

                {userData.role === "admin" && (
                  <SidebarBtn
                    icon="⚡"
                    label="Admin Dashboard"
                    onClick={() => navigate("/admin")}
                  />
                )}

                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-100">
                  <SidebarBtn
                    icon="🚪"
                    onClick={() => navigate("/logout")}
                    label="Logout"
                    danger
                  />
                </div>
              </nav>
            </div>
          </div>

          {/* --- RIGHT CONTENT AREA --- */}
          <div className="lg:col-span-9 space-y-6 sm:space-y-8">
            {/* TAB 1: PROFILE INFO */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 p-6 sm:p-8 md:p-12">
                <div className="flex justify-between items-center mb-6 sm:mb-10">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-black uppercase italic">
                      Personal Information
                    </h3>
                    <p className="text-gray-400 text-[10px] sm:text-[11px] mt-1 font-bold uppercase tracking-widest">
                      Your identity and contact details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-x-12 sm:gap-y-8">
                  <InfoBox label="Full Name" value={userData.fullName} />
                  <InfoBox label="Phone Number" value={userData.phone} />
                  <InfoBox label="Email Address" value={userData.email} fullWidth />
                </div>

                {userData.role === "admin" && (
                  <div className="mt-10 sm:mt-14 p-6 sm:p-8 bg-red-50/40 border border-red-100 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm text-2xl border border-red-50">
                      🛡️
                    </div>
                    <div>
                      <h4 className="text-red-700 font-black text-[11px] sm:text-[12px] uppercase tracking-[0.15em]">
                        Admin Privileges Active
                      </h4>
                      <p className="text-red-600/80 text-xs sm:text-[13px] mt-1.5 sm:mt-2 font-medium leading-relaxed">
                        Your account is authorized for system management. You can access product inventory, user logs, and financial reports from the central dashboard.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SAVED ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 p-6 sm:p-8 md:p-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tighter text-black uppercase italic">
                      Saved Addresses ({addresses?.length || 0})
                    </h3>
                    <p className="text-gray-400 text-[10px] sm:text-[11px] mt-1 font-bold uppercase tracking-widest">
                      Manage all your saved delivery addresses
                    </p>
                  </div>
                  <button
                    onClick={handleAddNewClick}
                    className="w-full sm:w-auto bg-black text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md"
                  >
                    + Add New Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {addresses && addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 transition-all relative ${addr.isDefault
                            ? "border-black bg-gray-50/60 shadow-sm"
                            : "border-gray-100 bg-white hover:border-gray-200"
                          }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full">
                            {addr.addressType || "Home"}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-base text-gray-900">
                          {addr.fullName}
                        </h4>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">
                          Ph: {addr.mobile}
                        </p>

                        <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed font-medium">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                          {addr.landmark ? `, Near ${addr.landmark}` : ""}
                          <br />
                          {addr.city}, {addr.state} -{" "}
                          <span className="font-bold">{addr.postalCode}</span>
                          <br />
                          {addr.country}
                        </p>

                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100/80">
                          {!addr.isDefault && (
                            <button
                              onClick={() => {
                                if (window.confirm("Are you sure you want to set this as your default delivery address?")) {
                                  handleSetDefaultAddress(addr._id);
                                }
                              }}
                              className="text-[11px] font-black uppercase tracking-widest text-orange-500 hover:underline"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => handleEditClick(addr)}
                            className="text-[11px] font-black uppercase tracking-widest text-black hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this address?")) {
                                handleDeleteAddress(addr._id);
                              }
                            }}
                            className="text-[11px] font-black uppercase tracking-widest text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold text-sm">
                        No saved addresses found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: MY ORDERS */}
            {activeTab === "orders" && (
              <MyOrdersUI userproduct={orders} navigate={navigate} />
            )}

            <AddEditAddressModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              isEditMode={Boolean(selectedAddress)}
              selectedAddressId={selectedAddress?._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarBtn = ({ icon, label, active, danger, onClick }) => (
  <button
    className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-[13px] transition-all duration-300 ${active
        ? "bg-black text-white shadow-xl shadow-gray-300 sm:translate-x-1"
        : "text-gray-500 hover:bg-gray-50 hover:text-black"
      } ${danger ? "text-red-500 hover:bg-red-50 hover:text-red-600" : ""}`}
    onClick={onClick}
  >
    <span className="text-lg sm:text-xl">{icon}</span> {label}
  </button>
);

const InfoBox = ({ label, value, fullWidth }) => {
  const isMissing = !value;

  return (
    <div className={`space-y-2 sm:space-y-3 ${fullWidth ? "md:col-span-2" : ""}`}>
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em] ml-1">
        {label}
      </label>
      <div
        className={`w-full px-5 sm:px-7 py-4 sm:py-5 rounded-[1.25rem] sm:rounded-[1.5rem] text-sm sm:text-[15px] font-bold transition-all flex justify-between items-center gap-2 ${isMissing
            ? "bg-orange-50/40 border-2 border-dashed border-orange-200 text-orange-400"
            : "bg-gray-50 border border-gray-50 text-gray-800 shadow-sm cursor-default"
          }`}
      >
        <span className="tracking-tight truncate">{value || `Not Provided`}</span>
        {isMissing && (
          <span className="text-[9px] bg-orange-500 text-white px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-black uppercase tracking-tighter shrink-0">
            Missing
          </span>
        )}
      </div>
    </div>
  );
};

const MyOrdersUI = ({ userproduct, navigate }) => {
  const orders = userproduct ? userproduct : [];

  const statusColors = {
    PROCESSING: "bg-amber-50 text-amber-600 border-amber-200",
    SHIPPED: "bg-blue-50 text-blue-600 border-blue-200",
    "OUT FOR DELIVERY": "bg-purple-50 text-purple-600 border-purple-200",
    DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {orders.length ? (
        <div>
          {/* LATEST PURCHASE */}
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-6 sm:mb-8">
            <div className="bg-gray-50/50 px-6 sm:px-8 py-3.5 sm:py-4 border-b border-gray-100 flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Latest Purchase
              </span>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                {orders[0].status}
              </span>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
                <div className="flex-1 space-y-4 w-full">
                  {orders[0].orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4 group">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt="Product"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase mt-0.5">
                          QTY: {item.quantity} | ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full md:w-auto md:text-right flex flex-row md:flex-col justify-between items-center md:items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                      Total Amount
                    </p>
                    <p className="text-xl sm:text-2xl font-black italic tracking-tighter">
                      ₹{Number(orders[0].totalPrice).toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="bg-black text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shrink-0"
                    onClick={() =>
                      navigate(`/trackorder/${orders[0]._id}`, {
                        state: { order: orders[0] },
                      })
                    }
                  >
                    Track Order
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PAST PURCHASES TABLE */}
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm p-6 sm:p-8 md:p-10">
            <h3 className="text-lg sm:text-xl font-black tracking-tighter uppercase italic mb-6 sm:mb-8 flex items-center gap-3">
              Past Purchases{" "}
              <span className="text-[10px] not-italic bg-gray-100 px-2 py-0.5 rounded-md text-gray-400">
                {orders.length}
              </span>
            </h3>

            <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
              <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Order Details
                    </th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell">
                      Date
                    </th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Total
                    </th>
                    <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...orders].map((order, idx) => (
                    <tr
                      key={order._id || idx}
                      onClick={() =>
                        navigate(`/order-details/${order._id}`, {
                          state: { order },
                        })
                      }
                      className="group hover:bg-gray-50 cursor-pointer transition-all"
                    >
                      <td className="py-4 sm:py-6">
                        <p className="text-xs sm:text-sm font-black tracking-tight group-hover:text-orange-600 transition-colors truncate max-w-[150px] sm:max-w-none">
                          {order._id}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold md:hidden mt-0.5">
                          {order.createdAt}
                        </p>
                      </td>
                      <td className="py-4 sm:py-6 hidden md:table-cell text-xs sm:text-sm font-bold text-gray-600">
                        {order.createdAt}
                      </td>
                      <td className="py-4 sm:py-6 text-xs sm:text-sm font-black">
                        ₹{Number(order.totalPrice).toFixed(2)}
                      </td>
                      <td className="py-4 sm:py-6 text-right">
                        <span
                          className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-[10px] uppercase tracking-widest font-black border transition-all ${statusColors[order.status] || "bg-gray-500 text-white"
                            }`}
                        >
                          {order.orderStatus || order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 bg-white rounded-3xl shadow-sm border border-gray-100 px-4 text-center">
          <div className="bg-gray-50 p-5 sm:p-6 rounded-full mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            No orders found
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xs mb-6 sm:mb-8">
            Looks like you haven't placed any orders yet. Start shopping to fill this space!
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 sm:px-8 py-3 bg-black text-white rounded-full text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg"
          >
            Explore Store
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;