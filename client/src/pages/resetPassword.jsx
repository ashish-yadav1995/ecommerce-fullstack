import React, { useState } from "react";
import { resetPassword } from "../services/authApi";
import { useLocation, useNavigate, Link } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const initialValue = {
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const [formData, setFormdata] = useState(initialValue);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };

  const validation = () => {
    const { otp, newPassword, confirmNewPassword } = formData;
    const formError = {};

    if (!otp.trim()) {
      formError.otp = "OTP is required.";
    }

    if (!newPassword.trim()) {
      formError.newPassword = "New password is required.";
    } else if (newPassword.trim().length < 6) {
      formError.newPassword = "Password must be at least 6 characters long.";
    }

    if (!confirmNewPassword.trim()) {
      formError.confirmNewPassword = "Confirm password is required.";
    } else if (newPassword.trim() !== confirmNewPassword.trim()) {
      formError.confirmNewPassword = "Passwords do not match.";
    }

    return formError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validateForm = validation();
    setError(validateForm);

    if (Object.keys(validateForm).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const { otp, newPassword } = formData;
      const response = await resetPassword(email, otp, newPassword);
      console.log("response", response);
      alert("Password reset successfully! Please login.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to reset password";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 w-full overflow-x-hidden font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-6 px-4">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Reset Password</h2>
          <p className="text-xs sm:text-sm mt-1 opacity-90 font-medium">Enter the OTP and your new password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">

          {/* OTP */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              OTP
            </label>
            <input
              type="text"
              name="otp"
              maxLength="6"
              placeholder="Enter 6 digit OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black text-xs sm:text-sm bg-gray-50 transition-all font-mono"
            />
            {error.otp && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-red-500 pl-1 border-l-2 border-red-500">
                <span>{error.otp}</span>
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black text-xs sm:text-sm bg-gray-50 transition-all"
            />
            {error.newPassword && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-red-500 pl-1 border-l-2 border-red-500">
                <span>{error.newPassword}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="••••••••"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black text-xs sm:text-sm bg-gray-50 transition-all"
            />
            {error.confirmNewPassword && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-red-500 pl-1 border-l-2 border-red-500">
                <span>{error.confirmNewPassword}</span>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {/* Back to Login */}
          <div className="text-center pt-2">
            <Link to="/login" className="text-xs sm:text-sm text-blue-600 font-bold hover:underline">
              Back to Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;