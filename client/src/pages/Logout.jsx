import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const { logout, loading } = useAuth();
  const navigate = useNavigate();

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen sm:min-h-[80vh] flex items-center justify-center bg-gray-50 p-4 sm:p-6 w-full overflow-x-hidden font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 text-center">

        {/* =========================
            ICON
        ========================= */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 sm:h-10 sm:w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </div>

        {/* =========================
            TEXT
        ========================= */}
        <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight mb-2">
          Oh no! You're leaving...
        </h1>

        <p className="text-gray-500 text-xs sm:text-sm font-medium mb-6 sm:mb-8 leading-relaxed">
          Are you sure you want to log out from MyStore?
          <br className="hidden sm:inline" />
          You'll need to login again to access your orders.
        </p>

        {/* =========================
            BUTTONS
        ========================= */}
        <div className="flex flex-col gap-3">
          {/* YES LOGOUT */}
          <button
            className="w-full py-3.5 sm:py-4 bg-black text-white rounded-2xl font-black text-xs sm:text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 disabled:opacity-50 active:scale-95"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? "Logging Out..." : "Yes, Log Me Out"}
          </button>

          {/* NO */}
          <button
            className="w-full py-3.5 sm:py-4 bg-transparent text-gray-400 rounded-2xl font-bold text-xs sm:text-sm hover:text-black transition-all"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            No, Take Me Back
          </button>
        </div>

        {/* =========================
            FOOTER
        ========================= */}
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
          MyStore Official
        </div>

      </div>
    </div>
  );
};

export default Logout;