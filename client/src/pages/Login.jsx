import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loader from "../components/Loader";

function Login() {
  const { login, loading, setLoading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  // =========================
  // DEMO CREDENTIAL FILL HELPERS
  // =========================
  const fillCustomerCredentials = () => {
    setValue("email", "ashishyadavrm01@gmail.com", { shouldValidate: true });
    setValue("password", "111111", { shouldValidate: true });
  };

  const fillSellerCredentials = () => {
    setValue("email", "ashishyadavrm0001@gmail.com", { shouldValidate: true });
    setValue("password", "111111", { shouldValidate: true });
  };

  const fillAdminCredentials = () => {
    setValue("email", "admin@test.com", { shouldValidate: true });
    setValue("password", "Admin@123", { shouldValidate: true });
  };

  // =========================
  // LOGIN SUBMIT
  // =========================
  const handleLogin = async (data) => {
    console.log("data login.jsx", data);
    try {
      const loggedInUser = await login(data);
      console.log("loggedInUser from login.jsx", loggedInUser);

      // =========================
      // ROLE BASED REDIRECT
      // =========================
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
              state: {
                email: errorData.email || data.email,
              },
            });
            break;

          case "ACCOUNT_DEACTIVATED":
            alert(message);
            break;

          default:
            alert(message);
        }
      } else {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 w-full overflow-x-hidden font-sans">
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-stretch gap-4">
        {/* =========================
            LOGIN FORM
        ========================= */}
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="bg-white p-6 sm:p-8 rounded-[1.5rem] shadow-xl w-full md:w-1/2 border border-gray-100"
        >
          <h2 className="text-xl sm:text-2xl font-black mb-6 text-center tracking-tight text-gray-900">
            Login
          </h2>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              Email Address
            </label>

            <input
              type="text"
              autoComplete="new-username"
              placeholder="name@example.com"
              className="w-full border border-gray-200 p-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-black transition-all"
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

          {/* PASSWORD */}
          <div className="mb-6 relative">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full border border-gray-200 p-3 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-black transition-all pr-10"
              {...register("password", {
                required: "Password is required",
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-400 text-sm"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

            {errors.password && (
              <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right mb-5">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-black hover:underline transition-all"
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 sm:py-4 rounded-xl font-black text-white text-xs sm:text-sm bg-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* REGISTER */}
          <p className="text-xs sm:text-sm text-gray-500 mt-6 text-center">
            Don&apos;t have an account?
            <span
              className="text-black font-bold cursor-pointer hover:underline ml-1"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </form>

        {/* =========================
            SIDE PANEL: DEMO ACCESS + REGISTER NOTE
        ========================= */}
        <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] shadow-xl w-full md:w-1/2 border border-gray-100 flex flex-col justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-gray-800 mb-2">
              ⚡ Quick Demo Login
            </p>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
              You can also{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-black font-bold underline hover:text-gray-700"
              >
                Register
              </button>{" "}
              with your own email ID (after OTP verification) and sign in, or
              test right away using the demo accounts below:
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={fillCustomerCredentials}
                className="w-full py-2.5 px-3 bg-gray-100 text-gray-900 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all text-left flex flex-col"
              >
                <span>Customer Demo</span>
                <span className="text-[10px] font-normal text-gray-600 truncate">
                  ashishyadavrm01@gmail.com
                </span>
              </button>

              <button
                type="button"
                onClick={fillSellerCredentials}
                className="w-full py-2.5 px-3 bg-gray-100 text-gray-900 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all text-left flex flex-col"
              >
                <span>Seller Demo</span>
                <span className="text-[10px] font-normal text-gray-600 truncate">
                  ashishyadavrm0001@gmail.com
                </span>
              </button>

              <button
                type="button"
                onClick={fillAdminCredentials}
                className="w-full py-2.5 px-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-all text-left flex flex-col"
              >
                <span>Admin Demo</span>
                <span className="text-[10px] font-normal text-gray-300 truncate">
                  admin@test.com
                </span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
            Click a button to fill the form, then click &ldquo;Sign In&rdquo;.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;