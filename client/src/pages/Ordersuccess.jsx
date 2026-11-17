import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.orderData;

  // Agar direct access karne ki koshish karein toh
  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-4 sm:p-6 text-center">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
          No order details found!
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm hover:bg-gray-800 transition-all"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 w-full overflow-x-hidden">
      <div className="max-w-md w-full text-center">
        {/* 1. Success Checkmark Icon */}
        <div className="mb-6 sm:mb-8 relative inline-block">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-green-500 text-white w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-100">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* 2. Heading & User Welcome */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 tracking-tight">
          Order Placed!
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm font-medium mb-8 sm:mb-10 leading-relaxed">
          Thank you! <br />
          Your order has been confirmed and it's being processed.
        </p>

        {/* 3. Order Summary Card */}
        <div className="bg-gray-50 rounded-[2rem] sm:rounded-[35px] p-6 sm:p-8 border border-gray-100 text-left mb-8 sm:mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>

          {/* Order ID */}
          <div className="flex justify-between items-center mb-4 sm:mb-5 gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] shrink-0">
              Order ID
            </span>
            <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm text-xs sm:text-sm truncate max-w-[180px] sm:max-w-[200px]">
              #{order._id || order.id}
            </span>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center mb-5 sm:mb-6">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              Total Amount
            </span>
            <span className="font-black text-xl sm:text-2xl text-black">
              ₹{Number(order.totalPrice || order.total || 0).toFixed(2)}
            </span>
          </div>

          <div className="h-[1px] bg-gray-200 w-full mb-5 sm:mb-6 opacity-50"></div>

          {/* Delivery Address */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
              Delivery Address
            </p>
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-medium">
              {typeof order.shippingAddress === "object"
                ? `${order.shippingAddress?.addressLine1 || order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""} - ${order.shippingAddress?.postalCode || order.shippingAddress?.pincode || ""}`
                : order.shippingAddress ||
                order.address ||
                "Address details saved in profile"}
            </p>
            <p className="text-gray-400 text-[11px] mt-2 italic font-medium">
              Payment Method:{" "}
              <span className="font-bold text-gray-600 uppercase">
                {order.paymentMethod || "COD"}
              </span>
            </p>
          </div>
        </div>

        {/* 4. Navigation Actions */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-black text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-base sm:text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate(`/order-details/${order._id || order.id}`)}
            className="text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-black transition-colors"
          >
            View Order Details
          </button>
        </div>

        {/* Footer */}
        <p className="mt-10 sm:mt-12 text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">
          Gemini Store • Thank You
        </p>
      </div>
    </div>
  );
}

export default OrderSuccess;