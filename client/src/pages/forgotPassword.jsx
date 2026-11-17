import React, { useState } from "react";
import { forgotPassword } from "../services/authApi";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const responseData = await forgotPassword(email.trim().toLowerCase());

      if (responseData?.success || responseData) {
        navigate("/reset-password", { state: { email: email.trim().toLowerCase() } });
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send reset OTP. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 w-full overflow-x-hidden font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-6 px-4">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Forgot Password</h2>
          <p className="text-xs sm:text-sm mt-1 opacity-90 font-medium">
            Enter your email to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              Email Address
            </label>

            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(""); // Clear error when typing
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-black text-xs sm:text-sm bg-gray-50 transition-all"
            />
          </div>

          {/* Error Banner */}
          {error && (
            <p className="text-xs text-red-500 font-bold text-center mt-2 bg-red-50 py-2.5 px-3 rounded-xl border border-red-100 flex items-center justify-center gap-1.5">
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
              <span>{error}</span>
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm py-3.5 rounded-xl transition-all active:scale-95 shadow-md disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send Reset OTP"}
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

export default ForgotPassword;