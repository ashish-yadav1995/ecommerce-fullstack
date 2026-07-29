import { set, useForm } from "react-hook-form";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setloading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(
    { mode: "onBlur" }, // Isse field se baahar nikalte hi error dikhega
  );

  const navigate = useNavigate();
  const location = useLocation();
  const Total = location.state.total;

  const handleform = (data) => {
    setloading(true);
    setTimeout(() => {
      const finalOrder = {
        id: Math.random().toString(36).substring(2, 9).toLocaleUpperCase(),
        fullname: `${data.username }`,
        items: cart,
        total: Total,
        address: data.address,
        city: data.city,
        zipcode: data.zipcode,
        date: new Date().toLocaleDateString(),
        orderDate_and_time: new Date().toISOString()
      };

      clearCart();
       console.log("finalOrder",finalOrder)
      navigate("/order-success", { state: { order: finalOrder } });
      setloading(false);
    }, 2000);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">
          Checkout Info
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* --- LEFT: SHIPPING FORM --- */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 italic border-l-4 border-black pl-3">
              Shipping Address
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit(handleform)}>
              <div className="grid grid-cols-1 md:grid-cols gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                   Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    placeholder="John Doe"
                    {...register("username", {
                      required: "Name is required",
                     
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Only letters allowed",
                      },
                    })}
                    value={user ? user.fullName: ""}
                    autoComplete="off"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.username.message}
                    </p>
                  )}
                </div>
                {/* <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    placeholder="Doe"
                    {...register("lastname", {
                      required: "Last name is required",
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Only letters allowed",
                      },
                      onChange: (e) => {
                        let value = e.target.value;

                        // 1. Double spaces ko single space mein convert karega
                        value = value.replace(/\s\s+/g, " ");

                        // 2. Shuruat mein space allow nahi karega
                        if (value.startsWith(" ")) {
                          value = value.trimStart();
                        }

                        e.target.value = value;
                      },
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Only letters allowed",
                      },
                    })}
                    autoComplete="off"
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.lastname.message}
                    </p>
                  )}
                </div> */}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                  placeholder="john@example.com"
                  {...register("email", {
                    required: "Email is required", // Khali hone par message
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address", // Pattern match na hone par message
                    },
                  })}
                   value={user ? user.email: ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-bold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Full Address
                </label>
                <textarea
                  rows="3"
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                  placeholder="Street, Apartment, Suite..."
                  {...register("address", {
                    required: "address is required!",
                    minLength: {
                      value: 10,
                      message: "Address must be in detail (min 10 chars)",
                    },
                  })}
                   value={user ? user.address: ""}
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-[10px] font-bold">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    placeholder="Mumbai"
                    {...register("city", { required: "City name is required" })}
                     value={user ? user.city: ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    {...register("zipcode", {
                      required: "Pincode is required",
                      pattern: {
                        value: /^[0-9]{6}$/, // Indian Pincode (6 digits)
                        message: "Zip code 6 digits ka hona chahiye",
                      },
                    })}
                     value={user ? user.zipcode: ""}
                    placeholder="400001"
                    maxLength="6"
                  />
                  {errors.zipcode && (
                    <p className="text-red-500 text-[10px] font-bold">
                      {errors.zipcode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="sumbit"
                  className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all active:scale-95 shadow-xl shadow-gray-200"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>

          {/* --- RIGHT: ORDER SUMMARY --- */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-10">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                In Your Bag
              </h2>

              {/* Product List (Static for now) */}
              {cart.map((item) => {
                return (
                  <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                    <div className="flex justify-between items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0">
                        <img src={item.images[0]} alt="" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        ₹{item.price}
                      </p>
                    </div>
                    {/* ...more items... */}
                  </div>
                );
              })}

              {/* Bill Details */}
              <div className="space-y-4 border-t border-gray-50 pt-6">
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>₹{Total}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold tracking-widest">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{Total}</span>
                </div>
              </div>

              {/* Security Hint */}
              <div className="mt-8 flex items-center justify-center gap-2 text-gray-300">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                </svg>
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Secure Payment Gateway
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
