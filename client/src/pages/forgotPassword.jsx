import React, { useState } from "react";
import { forgotPassword, resetPassword } from "../services/authApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("Email:", email);
      if (!email) {
        setError("Email is required");
        return;
      }

      let emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

      if (!emailPattern.test(email)) {
        setError("Please enter a valid email address");
        return; // Aage ka code execute hone se rokne ke liye
      }
      const responseData = await forgotPassword(email);

      if(responseData.success){
       navigate("/reset-password", {state:{email}})
      }

    } catch (error) {
        const message = error.response?.data?.message;
        alert(message)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-6">
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="text-sm mt-1">
            Enter your email to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            EMAIL
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* {error && (
            <p className="text-xs text-red-500 font-medium mt-1 text-left">
              {error}
            </p>
          )} */}

          {error && (
            <p className="text-xs text-red-500 font-medium text-center mt-3 bg-red-50 py-2 px-3 rounded-xl border border-red-100 flex items-center justify-center gap-1.5">
              {/* Ek chota warning icon (Optional) */}
              <svg
                className="w-4 h-4 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            Send Reset OTP
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

export default ForgotPassword;
