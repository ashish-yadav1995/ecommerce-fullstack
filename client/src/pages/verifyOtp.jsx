import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/authApi";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp) {
      setError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      await verifyOTP(email, otp);

      setMessage("Account verified successfully. Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setMessage("");

    try {
      setResendLoading(true);
      const response = await resendOTP(email);
      setMessage(response.message || "OTP sent successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 w-full overflow-x-hidden font-sans">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">

        {/* Header */}
        <h2 className="text-xl sm:text-2xl font-black text-center mb-2 text-gray-900 tracking-tight">
          Verify OTP
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 leading-relaxed">
          OTP has been sent to
          <br />
          <span className="font-bold text-black break-all">{email}</span>
        </p>

        {/* Form */}
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6 digit OTP"
              className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl text-center tracking-[0.4em] sm:tracking-[0.5em] placeholder:tracking-normal text-base sm:text-lg font-bold focus:outline-none focus:border-black transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-2 px-3 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          {message && (
            <p className="text-xs text-emerald-600 font-bold text-center bg-emerald-50 py-2 px-3 rounded-xl border border-emerald-100">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-black text-xs sm:text-sm mt-2 transition-all active:scale-95 shadow-md disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col gap-2.5 text-center">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="text-xs font-bold text-blue-600 hover:underline disabled:opacity-50"
          >
            {resendLoading ? "Sending..." : "Resend OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
          >
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default VerifyOtp;