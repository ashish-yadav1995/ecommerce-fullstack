// ===========================================

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loader from "../components/Loader";

function Login() {
  const { Login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const handleLogin = async (data) => {
      setLoading(true)
    try {
      
      const response = await Login(data.email, data.password);

      const loggedInUser = response.data;

      // Role ke according redirect
      if (loggedInUser.role === "admin") {
        navigate("/admin");
      } else if (loggedInUser.role === "seller") {
        navigate("/seller");
      } else {
        navigate("/");
      }
    } catch (error) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      const message = errorData?.message || "Invalid email or password.";

      if (status === 403) {
        switch (errorData?.code) {
          case "EMAIL_NOT_VERIFIED":
            alert(message);
            navigate("/verify-otp", {
              state: { email: errorData.email || data.email },
            });
            break;

          case "ACCOUNT_DEACTIVATED":
            alert(message);
            // User ko login nahi karne dena aur na hi OTP page bhejnahai
            break;

          default:
            alert(message);
        }
      } else {
        alert(message);
      }
    }finally{
      setLoading(false)
    }
  };

  if(loading) return <Loader/>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white p-8 rounded-[1.5rem] shadow-xl w-full max-w-sm border border-gray-100"
      >
        <h2 className="text-2xl font-black mb-6 text-center tracking-tight">
          Login
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
            Email Address
          </label>

          <input
            type="text"
            autoComplete="new-username"
            placeholder="name@example.com"
            className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black transition-all"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
          />

          {errors.email && (
            <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
            Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black transition-all"
            {...register("password", {
              required: "Password is required",
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-gray-400"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>

          {errors.password && (
            <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-5">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm font-semibold text-gray-600 hover:text-black hover:underline transition-all"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl font-black text-white bg-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
        >
          Sign In
        </button>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?
          <span
            className="text-black font-bold cursor-pointer hover:underline ml-1"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login;
