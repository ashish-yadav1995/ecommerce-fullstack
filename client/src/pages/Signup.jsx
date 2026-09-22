import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerSeller, registerUser } from "../services/authApi";

const Signup = () => {
  const navigate = useNavigate();

  const initialValue = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(initialValue);

  // false = customer, true = seller
  const [isSeller, setIsSeller] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState({});

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const formError = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.fullName.trim()) {
      formError.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      formError.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      formError.email = "Invalid email id";
    }

    if (!formData.password) {
      formError.password = "Password is required";
    } else if (formData.password.length < 6) {
      formError.password = "Minimum 6 characters required";
    }

    if (!formData.confirmPassword) {
      formError.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      formError.confirmPassword = "Passwords do not match";
    }

    return formError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      let response;

      const name = formData.fullName.trim();
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;

      if (isSeller) {
        response = await registerSeller(name, email, password);
      } else {
        response = await registerUser(name, email, password);
      }

      // OTP page par email bhejenge
      // navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
       navigate("/verify-otp", {state:{email:email}})

    } catch (error) {
      const errorData = error.response?.data
      const status = error.response?.status;
      const message = errorData?.message || "Registration failed. Please try again.";


        if(status === 403 && errorData?.code === "EMAIL_NOT_VERIFIED"){
          //  setError({ submit: message });
          alert(message)
           navigate("/verify-otp", {state:{email:errorData?.email}})
        }

      setError({
        submit: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Customer / Seller Toggle */}
      <div className="flex bg-white p-1 rounded-full shadow-md mb-6 w-64 border border-gray-200">
        <button
          type="button"
          onClick={() => {
            setIsSeller(false);
            setError({});
          }}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
            !isSeller ? "bg-blue-600 text-white shadow-lg" : "text-gray-500"
          }`}
        >
          Customer
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSeller(true);
            setError({});
          }}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
            isSeller ? "bg-green-600 text-white shadow-lg" : "text-gray-500"
          }`}
        >
          Seller
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div
          className={`py-4 text-center text-white font-bold text-xl transition-colors ${
            isSeller ? "bg-green-600" : "bg-blue-600"
          }`}
        >
          {isSeller ? "Seller Registration" : "Customer Registration"}
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              Full Name
            </label>

            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm"
            />

            {error.fullName && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
                {error.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              Email
            </label>

            <input
              name="email"
              type="email"
              autoComplete="new-username" 
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm"
            />

            {error.email && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
                {error.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              Password
            </label>

            <input
              name="password"
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[30px] text-gray-400"
            >
              {showPassword ? "👁️" : "🙈"}
            </button>

            {error.password && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
                {error.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              Confirm Password
            </label>

            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm"
            />

            {error.confirmPassword && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
                {error.confirmPassword}
              </p>
            )}
          </div>

          {/* Backend Error */}
          {error.submit && (
            <p className="text-sm text-red-500 font-bold text-center">
              {error.submit}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3.5 rounded-xl font-black text-base mt-2 transition-all active:scale-95 shadow-md ${
              isSeller
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Creating Account..." : "Register Account"}
          </button>
        </form>

        <p className="text-center pb-6 text-xs text-gray-500 font-medium">
          Already have an account?
          <Link
            to="/login"
            className="text-black font-black hover:underline ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
