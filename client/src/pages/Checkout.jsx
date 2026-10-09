import { useForm } from "react-hook-form";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, grandTotal, fetchCart } = useCart();
  const { placeOrder } = useOrder();
  const { addNewAddress } = useAuth();
  const [loading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  // Abhi sirf UI ke liye
  const handleForm = async (data) => {
    try {
      console.log("Checkout form data:", data);

      const addressResponse = await addNewAddress(data);

      const addressId = addressResponse?._id || addressResponse?.address?._id;

      if (!addressId) {
        alert("Address not saved. Please try again.");
        return;
      }

      console.log("Address saved with ID:", addressId);

      const orderData = await placeOrder(addressId, "COD");
      console.log("Order placed successfully:", orderData);

      navigate("/order-success", { state: { orderData } });
    } catch (error) {
      console.error("Checkout process error:", error);
      alert(
        error.response?.data?.message || "Checkout failed. Please try again.",
      );
    }
  };

  // Abhi static
  const Total = grandTotal || 0;

  useEffect(() => {
    fetchCart();
  }, []);

  console.log("Checkout cart data:", cart);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* PAGE TITLE */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-8 italic border-l-4 border-black pl-3">
                Shipping Address
              </h2>

              <form className="space-y-5" onSubmit={handleSubmit(handleForm)}>
                {/* FULL NAME */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    {...register("fullName", {
                      required: "Full name is required",
                      pattern: {
                        value: /^[A-Za-z\s]+$/,
                        message: "Only letters allowed",
                      },
                    })}
                  />

                  {errors.fullName && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* MOBILE */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    placeholder="9876543210"
                    maxLength="10"
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    {...register("mobile", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[6-9][0-9]{9}$/,
                        message: "Enter valid 10 digit mobile number",
                      },
                    })}
                  />

                  {errors.mobile && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                {/* ADDRESS LINE 1 */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Address Line 1
                  </label>

                  <input
                    type="text"
                    placeholder="House No, Building, Street"
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    {...register("addressLine1", {
                      required: "Address is required",
                      minLength: {
                        value: 5,
                        message: "Please enter complete address",
                      },
                    })}
                  />

                  {errors.addressLine1 && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      {errors.addressLine1.message}
                    </p>
                  )}
                </div>

                {/* ADDRESS LINE 2 */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Address Line 2
                  </label>

                  <input
                    type="text"
                    placeholder="Apartment, Floor, Area (Optional)"
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    {...register("addressLine2")}
                  />
                </div>

                {/* LANDMARK */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Landmark
                  </label>

                  <input
                    type="text"
                    placeholder="Near Railway Station (Optional)"
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    {...register("landmark")}
                  />
                </div>

                {/* CITY + STATE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      City
                    </label>

                    <input
                      type="text"
                      placeholder="Mumbai"
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                      {...register("city", {
                        required: "City is required",
                      })}
                    />

                    {errors.city && (
                      <p className="text-red-500 text-[10px] font-bold mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      State
                    </label>

                    <input
                      type="text"
                      placeholder="Maharashtra"
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                      {...register("state", {
                        required: "State is required",
                      })}
                    />

                    {errors.state && (
                      <p className="text-red-500 text-[10px] font-bold mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* COUNTRY + POSTAL CODE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      Country
                    </label>

                    <input
                      type="text"
                      defaultValue="India"
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                      {...register("country", {
                        required: "Country is required",
                      })}
                    />

                    {errors.country && (
                      <p className="text-red-500 text-[10px] font-bold mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                      Postal Code
                    </label>

                    <input
                      type="text"
                      placeholder="400001"
                      maxLength="6"
                      className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                      {...register("postalCode", {
                        required: "Postal code is required",
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: "Postal code must be 6 digits",
                        },
                      })}
                    />

                    {errors.postalCode && (
                      <p className="text-red-500 text-[10px] font-bold mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* ADDRESS TYPE */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Address Type
                  </label>

                  <select
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                    {...register("addressType")}
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* DEFAULT ADDRESS */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    {...register("isDefault")}
                  />

                  <label className="text-sm font-medium text-gray-700">
                    Save as default address
                  </label>
                </div>

                {/* BUTTON */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 transition-all active:scale-95 shadow-xl shadow-gray-200"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-10">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              {/* PRODUCTS */}
              <div className="space-y-4 mb-8 max-h-72 overflow-y-auto pr-2">
                {cart?.map((item, index) => {
                  const product = item.product || item;

                  return (
                    <div
                      key={item._id || product._id || index}
                      className="flex justify-between items-center gap-4"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={product.images?.[0]}
                          alt={product.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">
                          {product.name || product.title}
                        </p>

                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-gray-900">
                        ₹
                        {product.discountPrice > 0
                          ? product.discountPrice
                          : product.price}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* BILL DETAILS */}
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

              {/* SECURITY */}
              <div className="mt-8 flex items-center justify-center gap-2 text-gray-300">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                </svg>

                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Secure Checkout
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
