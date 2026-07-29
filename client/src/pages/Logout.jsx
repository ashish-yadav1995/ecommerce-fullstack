import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  // Logic aap khud handle karoge (setUser(null) etc.)
  // Bas UI elements ka maza lo!
  const { Logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
        {/* Visual Icon */}
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
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

        {/* Text Content */}
        <h1 className="text-2xl font-black text-black tracking-tight mb-2">
          Oh no! You're leaving...
        </h1>
        <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
          Are you sure you want to log out from MyStore? <br />
          You'll need to login again to access your orders.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
            onClick={Logout}
          >
            Yes, Log Me Out
          </button>

          <button className="w-full py-4 bg-transparent text-gray-400 rounded-2xl font-bold text-sm hover:text-black transition-all"
          onClick={() => navigate(-1)}
          >
            No, Take Me Back
          </button>
        </div>

        {/* Footer Brand */}
        <div className="mt-10 pt-6 border-t border-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
          MyStore Official
        </div>
      </div>
    </div>
  );
};

export default Logout;
