import React, { useEffect, useState } from "react";
import { getAllAdminUsers, activateUser, deactivateUser } from "../../services/adminApi";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // 👈 User modal state

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllAdminUsers();
      setUsers(res.users || res.data || res || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (e, id, currentStatus) => {
    e.stopPropagation(); // 👈 Row click par modal khulne se rokne ke liye
    try {
      if (currentStatus) {
        await deactivateUser(id);
      } else {
        await activateUser(id);
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !currentStatus } : u))
      );
    } catch (error) {
      alert(error.response?.data?.message || "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="font-bold text-gray-500">Loading users...</p>
      </div>
    );
  }
debugger
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-6">Manage Users</h1>

        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {users.map((u) => (
                <tr 
                  key={u._id} 
                  onClick={() => setSelectedUser(u)} // 👈 Row click par user data modal khulega
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-4 px-6 font-bold text-gray-900">{u.name}</td>
                  <td className="py-4 px-6 text-gray-600">{u.email}</td>
                  <td className="py-4 px-6 font-bold text-indigo-600 text-xs uppercase">{u.role}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.isActive !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                      {u.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={(e) => handleToggleStatus(e, u._id, u.isActive !== false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        u.isActive !== false
                          ? "border border-red-500 text-red-600 hover:bg-red-50"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      {u.isActive !== false ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

 {/* USER DETAIL MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white font-bold transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl font-black">
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{selectedUser.name}</h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                  {selectedUser.role}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Email Address</span>
                <span className="font-bold text-gray-800 text-sm">{selectedUser.email}</span>
              </div>

              {selectedUser.phone && (
                <div>
                  <span className="text-gray-400 block font-medium">Phone Number</span>
                  <span className="font-bold text-gray-800 text-sm">{selectedUser.phone}</span>
                </div>
              )}

              {/* ADDRESS SECTION (String, Object, ya Array sab handle karega) */}
              <div>
                <span className="text-gray-400 block font-medium">Saved Address</span>
                {(() => {
                  // Case 1: Agar addresses array hai (e.g. selectedUser.addresses)
                  if (Array.isArray(selectedUser.addresses) && selectedUser.addresses.length > 0) {
                    return (
                      <div className="space-y-1.5 mt-1">
                        {selectedUser.addresses.map((addr, idx) => (
                          <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium">
                            {typeof addr === "string"
                              ? addr
                              : [addr.street, addr.addressLine1, addr.city, addr.state, addr.pincode || addr.zipCode]
                                  .filter(Boolean)
                                  .join(", ")}
                          </div>
                        ))}
                      </div>
                    );
                  }

                  // Case 2: Agar single address object hai (e.g. selectedUser.address)
                  if (selectedUser.address && typeof selectedUser.address === "object") {
                    const formatted = [
                      selectedUser.address.street,
                      selectedUser.address.addressLine1,
                      selectedUser.address.city,
                      selectedUser.address.state,
                      selectedUser.address.pincode || selectedUser.address.zipCode,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    return formatted ? (
                      <span className="font-bold text-gray-800 text-sm block mt-0.5">{formatted}</span>
                    ) : (
                      <span className="text-gray-400 italic">No address saved</span>
                    );
                  }

                  // Case 3: Agar address simple string hai
                  if (typeof selectedUser.address === "string" && selectedUser.address.trim() !== "") {
                    return <span className="font-bold text-gray-800 text-sm block mt-0.5">{selectedUser.address}</span>;
                  }

                  return <span className="text-gray-400 italic">No address saved</span>;
                })()}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                <div>
                  <span className="text-gray-400 block font-medium">Account Status</span>
                  <span className={`font-bold text-sm ${selectedUser.isActive !== false ? "text-green-600" : "text-red-600"}`}>
                    {selectedUser.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Joined On</span>
                  <span className="font-bold text-gray-800">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;