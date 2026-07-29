import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isactive, setIsActive] = useState(true);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  // Jab Context connect karoge, toh ye data 'useAuth()' se aayega
  const [userData, setUserData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role, // Ise 'admin' karke check kar sakte ho toggle
    gender: user.gender ? user.gender : "", // Empty field (Orange dashed dikhegi)
    dob: user.dob ? user.dob : "", // Empty field
    address: user.address, // Empty field
    joinDate: "April 2026",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const saveChanges = () => {
    const allUser = JSON.parse(localStorage.getItem("all_users"));
    const modifiedUser = allUser.map((regisUser) => {
      return regisUser.email === user.email
        ? {
            ...regisUser,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            role: user.role,
            gender: userData.gender,
            dob: userData.dob,
            address: userData.address,
          }
        : regisUser;
    });

    setUser({
      ...user,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      role: user.role,
      gender: userData.gender,
      dob: userData.dob,
      address: userData.address,
    });

    localStorage.setItem("all_users", JSON.stringify(modifiedUser));
    setIsEditing(false);
  };


  useEffect(() => {
  const updateStatus = () => {
    if (!user?.orders) return;

    const formatOrderDate = (dateString, minutesToAdd) => {
      const options = { month: 'long', day: 'numeric' };
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
      const d = new Date(dateString);
      d.setMinutes(d.getMinutes() + minutesToAdd);
      
      return `${d.toLocaleDateString('en-US', options)}, ${d.toLocaleTimeString('en-US', timeOptions)}`;
    };

    const updatedOrders = user.orders.map((order) => {
      const originalDate = order.orderDate_and_time;
      const orderTime = new Date(originalDate);
      const currentTime = new Date();
      const minutesPassed = Math.floor((currentTime - orderTime) / (1000 * 60));

      let newStatus = order.status;
      let updates = {};

      // Logic: Status check aur Time Calculation
      if (minutesPassed >= 5 && order.status !== "DELIVERED") {
        newStatus = "DELIVERED";
        updates = {
          processingTime: formatOrderDate(originalDate, 0),
          shippedTime: formatOrderDate(originalDate, 2),
          outForDeliveryTime: formatOrderDate(originalDate, 4),
          deliveredTime: formatOrderDate(originalDate, 5),
        };
      } else if (minutesPassed >= 4 && order.status === "SHIPPED") {
        newStatus = "OUT FOR DELIVERY";
        updates = {
          outForDeliveryTime: formatOrderDate(originalDate, 4),
          deliveredTime: "Pending (Estimated: " + formatOrderDate(originalDate, 5) + ")",
        };
      } else if (minutesPassed >= 2 && order.status === "PROCESSING") {
        newStatus = "SHIPPED";
        updates = {
          processingTime: formatOrderDate(originalDate, 0),
          shippedTime: formatOrderDate(originalDate, 2),
          outForDeliveryTime: "Estimated: " + formatOrderDate(originalDate, 4),
          deliveredTime: "Estimated: " + formatOrderDate(originalDate, 5),
        };
      }

      if (newStatus !== order.status) {
        return { ...order, status: newStatus, ...updates };
      }
      return order;
    });

    const isDifferent = JSON.stringify(updatedOrders) !== JSON.stringify(user.orders);

    if (isDifferent) {
      setUser((prev) => ({ ...prev, orders: updatedOrders }));
    }
  };

  updateStatus();
  // Interval ko 10-30 seconds rakhein taaki UI update hota dikhe
  const interval = setInterval(updateStatus, 10000); 

  return () => {
    console.log("Cleanup: Interval Cleared");
    clearInterval(interval);
  };
}, [user?.orders]); 

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col font-sans">
      {/* --- PREMIUM BLACK HEADER --- */}
      <div className="bg-black text-white pt-16 pb-28 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              My Account
            </h1>
            <p className="text-gray-400 mt-2 font-medium tracking-wide">
              Manage your profile, addresses and orders
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1">
              Member Since
            </p>
            <p className="text-sm font-bold tracking-tight">
              {userData.joinDate}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full -mt-16 px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- LEFT SIDEBAR: PROFILE CARD --- */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 sticky top-10">
              <div className="flex flex-col items-center text-center">
                <div className="relative group cursor-pointer">
                  <div className="w-28 h-28 bg-black rounded-full flex items-center justify-center text-4xl font-black text-white border-8 border-gray-50 shadow-xl transition-transform group-hover:scale-105">
                    {userData.fullName?.charAt(0)}
                  </div>
                  <div className="absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 group-hover:bg-gray-50 transition-all">
                    <span className="text-xs">📷</span>
                  </div>
                </div>
                <h2 className="mt-6 text-xl font-black text-black tracking-tight">
                  {userData.fullName}
                </h2>
                <span
                  className={`mt-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-sm
                  ${userData.role === "admin" ? "bg-red-50 text-red-500 border border-red-100" : "bg-black text-white"}`}
                >
                  {userData.role}
                </span>
              </div>

              <nav className="mt-12 space-y-2">
                <SidebarBtn
                  icon="👤"
                  label="Profile Info"
                  onClick={() => setIsActive(true)}
                  active={isactive}
                />
                <SidebarBtn
                  icon="📦"
                  label="My Orders"
                  onClick={() => setIsActive(false)}
                  active={!isactive}
                />
                <div className="pt-6 mt-6 border-t border-gray-100">
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

          {/* --- RIGHT CONTENT: PERSONAL INFO --- */}
          <div className="lg:col-span-9 space-y-8">
            {isactive ? (
              <>
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12 transition-all">
                  <div className="flex justify-between items-center mb-12">
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter text-black uppercase italic">
                        Personal Information
                      </h3>
                      <p className="text-gray-400 text-[11px] mt-1 font-bold uppercase tracking-widest">
                        Update your identity and contact details
                      </p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-400 hover:border-gray-400 transition-all"
                      >
                        Edit Details
                      </button>
                    )}
                  </div>

                  {/* GRID OF FIELDS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <EditableBox
                      label="Full Name"
                      name="fullName"
                      value={userData.fullName}
                      onChange={handleChange}
                      isEditing={isEditing}
                    />
                    <EditableBox
                      label="Phone Number"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      isEditing={isEditing}
                    />
                    <EditableBox
                      label="Email Address"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      isEditing={isEditing}
                    />
                    <EditableBox
                      label="Gender"
                      value={userData.gender}
                      name="gender"
                      onChange={handleChange}
                      isEditing={isEditing}
                      type="select"
                    />
                    <EditableBox
                      label="Date of Birth"
                      name="dob"
                      value={userData.dob}
                      onChange={handleChange}
                      isEditing={isEditing}
                      type="date"
                    />
                    <EditableBox
                      label="Full Address"
                      name="address"
                      value={userData.address}
                      onChange={handleChange}
                      isEditing={isEditing}
                      type="textarea"
                      fullWidth
                    />
                  </div>

                  {/* ADMIN PRIVILEGES (Only visible if role is admin) */}
                  {userData.role === "admin" && (
                    <div className="mt-14 p-8 bg-red-50/40 border border-red-100 rounded-[2rem] flex items-start gap-6">
                      <div className="bg-white p-4 rounded-2xl shadow-sm text-2xl border border-red-50">
                        🛡️
                      </div>
                      <div>
                        <h4 className="text-red-700 font-black text-[12px] uppercase tracking-[0.15em]">
                          Admin Privileges Active
                        </h4>
                        <p className="text-red-600/80 text-[13px] mt-2 font-medium leading-relaxed max-w-xl">
                          Your account is authorized for system management. You
                          can access product inventory, user logs, and financial
                          reports from the central dashboard.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ACTION BUTTONS (Only when Editing) */}
                  {isEditing && (
                    <div className="mt-12 flex flex-col md:flex-row gap-4 pt-10 border-t border-gray-100">
                      <button
                        onClick={() => saveChanges()}
                        className="flex-2 bg-black text-white py-5 px-10 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-100 text-gray-400 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-gray-200 hover:text-gray-600 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <MyOrdersUI userproduct={user}  navigate={navigate} />
            )}

            {/* RECENT ACTIVITY SECTION */}
            {/* <div className="bg-white rounded-[3rem] shadow-sm border border-gray-50 p-16 flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-20 border border-gray-100">🛒</div>
               <h3 className="text-xl font-black text-black uppercase tracking-tight italic">No Recent Orders</h3>
               <p className="text-gray-400 text-sm mt-2 max-w-xs font-medium">Your shopping cart is waiting. Start your journey with our latest collections.</p>
               <button className="mt-8 px-10 py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-lg">
                 Start Shopping
               </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODERN SUB-COMPONENTS ---

const SidebarBtn = ({
  icon,
  label,
  active,
  danger,
  onClick,
  toggle,
  isactive,
}) => (
  <button
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[13px] transition-all duration-300
    ${active ? "bg-black text-white shadow-xl shadow-gray-300 translate-x-1" : "text-gray-500 hover:bg-gray-50 hover:text-black"} 
    ${danger ? "text-red-500 hover:bg-red-50 hover:text-red-600" : ""}`}
    onClick={onClick}
  >
    <span className="text-xl">{icon}</span> {label}
  </button>
);

const EditableBox = ({
  label,
  value,
  name,
  onChange,
  isEditing,
  type = "text",
  fullWidth,
}) => {
  const isMissing = !value && !isEditing;

  return (
    <div className={`space-y-3 ${fullWidth ? "md:col-span-2" : ""}`}>
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.25em] ml-1">
        {label}
      </label>

      {isEditing ? (
        type === "textarea" ? (
          <textarea
            className="w-full px-6 py-5 bg-gray-50 border border-black/5 rounded-[1.5rem] text-[15px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
            rows="4"
            defaultValue={value}
            name={name}
            onChange={onChange}
          />
        ) : type === "select" ? (
          <select
            className="w-full px-6 py-5 bg-gray-50 border border-black/5 rounded-[1.5rem] text-[15px] font-bold focus:bg-white focus:border-black/20 outline-none appearance-none cursor-pointer"
            name={name}
            onChange={onChange}
          >
            <option value="">Choose Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : (
          <input
            type={type}
            name={name}
            className="w-full px-6 py-5 bg-gray-50 border border-black/5 rounded-[1.5rem] text-[15px] font-bold focus:bg-white focus:border-black/20 outline-none transition-all shadow-inner"
            defaultValue={value}
            onChange={onChange}
          />
        )
      ) : (
        <div
          className={`w-full px-7 py-5 rounded-[1.5rem] text-[15px] font-bold transition-all flex justify-between items-center 
          ${
            isMissing
              ? "bg-orange-50/40 border-2 border-dashed border-orange-200 text-orange-400"
              : "bg-gray-50 border border-gray-50 text-gray-800 shadow-sm hover:shadow-md cursor-default"
          }`}
        >
          <span className="tracking-tight">{value || `Add ${label}`}</span>
          {isMissing && (
            <span className="text-[9px] bg-orange-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter">
              Required
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const MyOrdersUI = ({ userproduct, navigate }) => {
  const orders = userproduct.orders ? userproduct.orders : [];
  console.log(userproduct)

  const getStatusStyles = (orderStatus) => {
    status == "p" ? "p" : status == "s" ? "s" : status == "out" ? "out" : "d";
  };
  const statusColors = {
    PROCESSING: "bg-amber-50 text-amber-600 border-amber-200",
    SHIPPED: "bg-blue-50 text-blue-600 border-blue-200",
    "OUT FOR DELIVERY": "bg-purple-50 text-purple-600 border-purple-200",
    DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {orders.length ? (
          <div>
            {/* --- SECTION 1: RECENT ORDER HIGHLIGHT --- */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Latest Purchase
                </span>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                  {orders?.length > 0
                    ? orders[orders.length - 1].status
                    : "Loading..."}
                </span>
              </div>

              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Order Brief */}
                  <div className="flex-1 space-y-4">
                    {orders[orders.length - 1].items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {/* {item.img} */}
                          <img
                            src={item.img}
                            alt="Product"
                            style={{ width: "200px", borderRadius: "8px" }}
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-tight">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-gray-400 font-bold uppercase">
                            QTY: {item.qty} • {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price & Action */}
                  <div className="w-full md:w-auto md:text-right flex md:flex-col justify-between items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        Total Amount
                      </p>
                      <p className="text-2xl font-black italic tracking-tighter">
                        {orders[orders.length - 1].total.toFixed(2)}
                      </p>
                    </div>
                    <button className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all" onClick={() => navigate("/trackorder",{ state: { order: orders[orders.length - 1] } })}>
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* --- SECTION 2: ORDER HISTORY LIST --- */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
              <h3 className="text-xl font-black tracking-tighter uppercase italic mb-8 flex items-center gap-3">
                Past Purchases{" "}
                <span className="text-[10px] not-italic bg-gray-100 px-2 py-0.5 rounded-md text-gray-400">
                  {orders.length}
                </span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
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
  {[...orders].reverse().map((order) => (
    <tr
      key={order.id}
      // 1. onClick navigate logic with state
      onClick={() => navigate(`/order-details/${order.id}`, { state: { order } })}
      // 2. cursor-pointer and hover classes for better UX
      className="group hover:bg-gray-50 cursor-pointer transition-all active:scale-[0.99]"
    >
      <td className="py-6">
        <p className="text-sm font-black tracking-tight group-hover:text-orange-600 transition-colors">
          {order.id}
        </p>
        <p className="text-[10px] text-gray-400 font-bold md:hidden">
          {order.date}
        </p>
      </td>
      
      <td className="py-6 hidden md:table-cell text-sm font-bold text-gray-600">
        {order.date}
      </td>
      
      <td className="py-6 text-sm font-black">
        <span>${Number(order.total).toFixed(2)}</span>
      </td>
      
      <td className="py-6 text-right">
        <span
          className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-black border transition-all
            ${statusColors[order.status] || "bg-gray-500 text-white"}`}
        >
          {order.status}
        </span>
      </td>
    </tr>
  ))}
</tbody>
                </table>
              </div>

              {/* View All Button */}
              <button className="w-full mt-8 py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:border-black hover:text-black transition-all">
                Load More History
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {orders && orders.length > 0 ? (
              // Yahan aapka existing orders list ka logic aayega
              <div className="space-y-6">
                {/* Latest Purchase & Past Purchases components */}
              </div>
            ) : (
              // Jab order na ho toh ye UI dikhega
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                {/* Ek subtle icon jo aapke black/white theme se match kare */}
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="坠"
                    />
                    {/* Default Box Icon */}
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No orders found
                </h2>
                <p className="text-gray-500 text-center max-w-xs mb-8">
                  Looks like you haven't placed any orders yet. Start shopping
                  to fill this space!
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Explore Store
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
