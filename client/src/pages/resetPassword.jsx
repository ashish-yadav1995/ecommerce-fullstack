import React, { useState } from "react";
import { resetPassword } from "../services/authApi";
import { useLocation, useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    setFormdata({
      ...formData,
      [name]: value,
    });
  };
  console.log(error);

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
      const { otp, newPassword } = formData;
      const response = await resetPassword(email, otp, newPassword);
      console.log("response", response);
      navigate("/login");
    } catch (error) {
      const message = error.response.data.message;
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-6">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="text-sm mt-1">Enter the OTP and your new password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* OTP */}
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            OTP
          </label>

          <input
            type="text"
            name="otp"
            maxLength="6"
            placeholder="Enter 6 digit OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* {error.otp && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
                {error.otp}
              </p>
            )} */}
          {error.otp && (
            <p className="flex items-center gap-1.5 mt-2 text-xs font-bold text-red-500 pl-1 border-l-2 border-red-500">
              <span>{error.otp}</span>
            </p>
          )}

          {/* New Password */}
          <label className="block text-sm font-semibold text-gray-600 mt-5 mb-2">
            NEW PASSWORD
          </label>

          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* {error.newPassword && (
            <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
              {error.newPassword}
            </p>
          )} */}

          {error.newPassword && (
            <p className="flex items-center gap-1.5 mt-2 text-xs font-bold text-red-500 pl-1 border-l-2 border-red-500">
              <span>{error.newPassword}</span>
            </p>
          )}

          {/* Confirm Password */}
          <label className="block text-sm font-semibold text-gray-600 mt-5 mb-2">
            CONFIRM PASSWORD
          </label>

          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm new password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* {error.confirmNewPassword && (
            <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
              {error.confirmNewPassword}
            </p>
          )} */}

          {error.confirmNewPassword && (
            <p className="flex items-center gap-1.5 mt-2 text-xs font-bold text-red-500 pl-1 border-l-2 border-red-500">
              <span>{error.confirmNewPassword}</span>
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            Reset Password
          </button>

          <div className="text-center mt-5">
            <a href="/login" className="text-blue-600 hover:underline text-sm">
              Back to Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
