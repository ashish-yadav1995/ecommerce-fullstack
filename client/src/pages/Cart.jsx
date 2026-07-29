// import { useCart } from "../context/CartContext";
// import { Link, useNavigate } from "react-router-dom";
// import Movetocart from "./Movetocart";
// import { useState } from "react";

// function Cart() {
//   const [seelaterproduct, setSeelaterproduct] = useState([]);
//   const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
//   const navigate = useNavigate();

//   const seeforlater = (product) => {
//     setSeelaterproduct((prev) => {
//       const exist = prev.find((item) => item.id);

//       if (!exist) {
//         return [product];
//       }
//       return [...prev, product];
//     });

//     // 3. IMPORTANT: Cart se wo item remove bhi karna hoga
//     removeFromCart(product.id);
//   };

//   const movetocarthandler = (id)=>{
//      setSeelaterproduct(()=>{
//       return seelaterproduct.filter((item)=> item.id !== id)
//      })
//   }
//    const deletehandler = (id)=>{
//      setSeelaterproduct(()=>{
//       return seelaterproduct.filter((item)=> item.id !== id)
//      })
//   }

//   const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   return (
//     <>
//       <div className="max-w-7xl mx-auto p-6">
//         <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

//         {/* Empty State */}
//         {cart.length === 0 && (
//           <div className="text-center mt-20">
//             <h2 className="text-2xl text-gray-400">Your cart is empty 🛒</h2>
//           </div>
//         )}

//         {/* Grid Container: Responsive layout */}
//         {/* sm: 1 card, md: 2 cards, lg: 3 cards, xl: 4 cards */}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {cart.map((product) => (
//             <div
//               key={product.id}
//               className="flex flex-col bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div>
//                 <Link to="/productdetail" state={{ product }}>
//                   {/* Image Section */}
//                   <div className="h-40 w-full flex justify-center items-center mb-4">
//                     <img
//                       src={product.images[0]}
//                       alt={product.title}
//                       className="h-full object-contain"
//                     />
//                   </div>

//                   {/* Product Details */}
//                   <div className="flex-1 text-center">
//                     <h4 className="font-semibold text-sm mb-1 h-10 overflow-hidden">
//                       {product.title.slice(0, 40)}...
//                     </h4>
//                     <p className="text-gray-500 text-xs mb-2">
//                       Unit Price: ₹{product.price}
//                     </p>
//                     <p className="font-bold text-lg text-black mb-4">
//                       Subtotal: ₹{(product.price * product.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 </Link>
//               </div>
//               {/* Quantity Controls */}
//               <div className="flex items-center justify-center gap-4 bg-gray-50 py-2 rounded-lg mb-4">
//                 <button
//                   className="w-8 h-8 flex items-center justify-center bg-white border rounded-full hover:bg-gray-100 font-bold"
//                   onClick={() => decreaseQty(product.id)}
//                 >
//                   -
//                 </button>
//                 <span className="font-bold">{product.quantity}</span>
//                 <button
//                   className="w-8 h-8 flex items-center justify-center bg-white border rounded-full hover:bg-gray-100 font-bold"
//                   onClick={() => increaseQty(product.id)}
//                 >
//                   +
//                 </button>

//                 <button onClick={() => seeforlater(product)}>
//                   See for later
//                 </button>
//               </div>

//               {/* Remove Button */}
//               <button
//                 className="w-full text-red-500 text-sm font-bold hover:text-red-700 transition-colors border-t border-black pt-3 mt-2"
//                 onClick={() => removeFromCart(product.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Total Section */}
//         {cart.length !== 0 && (
//           <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-gray-200 shadow-sm text-right relative overflow-hidden">
//             {/* Background Decoration (Optional: Subtle design element) */}
//             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>

//             {/* Summary Rows */}
//             <div className="flex flex-col gap-3 mb-8">
//               <div className="flex justify-end items-center gap-6 text-gray-500 text-sm">
//                 <span>Subtotal</span>
//                 <span className="font-semibold text-gray-800">
//                   ₹ {total.toFixed(2)}
//                 </span>
//               </div>
//               <div className="flex justify-end items-center gap-6 text-gray-500 text-sm">
//                 <span>Shipping Fee</span>
//                 <span className="text-green-600 font-bold">FREE</span>
//               </div>
//               <div className="flex justify-end items-center gap-6 text-gray-500 text-sm">
//                 <span>Tax (GST)</span>
//                 <span className="font-semibold text-gray-800">Included</span>
//               </div>
//             </div>

//             {/* Subtle Divider */}
//             <div className="h-[1px] bg-gray-200 w-full mb-8"></div>

//             {/* Total Display */}
//             <div className="mb-8">
//               <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">
//                 Grand Total
//               </p>
//               <h2 className="text-5xl font-extrabold text-gray-900 tracking-tighter">
//                 ₹ {total.toFixed(2)}
//               </h2>
//             </div>

//             {/* Action Button: Pill shape and subtle shadow */}
//             <button
//               className="w-full md:w-auto bg-black text-white px-14 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200 flex items-center justify-center gap-3 ml-auto group"
//               onClick={(e) => {
//                 navigate("/checkout");
//               }}
//             >
//               <span>Proceed to Checkout</span>
//               <svg
//                 className="w-5 h-5 group-hover:translate-x-1 transition-transform"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M14 5l7 7m0 0l-7 7m7-7H3"
//                 />
//               </svg>
//             </button>

//             {/* Footer Disclaimer */}
//             <p className="mt-6 text-[11px] text-gray-400 font-medium">
//               By clicking Place Order, you agree to our Terms of Service.
//             </p>
//           </div>
//         )}
//       </div>
//       <Movetocart cart={seelaterproduct} movetocarthandler={movetocarthandler}  deletehandler={deletehandler} />
//     </>
//   );
// }

// export default Cart;


import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Savetocart from "./TempCart";
import { useState } from "react";
import { useWishList } from "../context/WishlistContext";

function Cart() {
  const [seelaterproduct, setSeelaterproduct] = useState([]);
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const {Wishlist, addToWishlist, removeFromWishlist} = useWishList()
  const navigate = useNavigate();

  // 1. Save for Later Logic
  // const seeforlater = (product) => {
  //   setSeelaterproduct((prev) => {
  //     const isExist = prev.find((item) => item.id === product.id);
  //     if (isExist) return prev; 
  //     return [...prev, product];
  //   });
  //   removeFromCart(product.id);
  // };

  // 2. Handlers for Saved Items
  const movetocarthandler = (id) => {
    setSeelaterproduct((prev) => prev.filter((item) => item.id !== id));
  };

  // const deletehandler = (id) => {
  //   setSeelaterproduct((prev) => prev.filter((item) => item.id !== id));
  // };

  // 3. Simple Total (Saare items count honge)
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-black mb-8 text-gray-900 tracking-tight">Shopping Cart</h1>

      {/* Empty Cart UI */}
      {cart.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <h2 className="text-2xl text-gray-400 font-medium">Your cart is empty 🛒</h2>
        </div>
      )}

      {/* Cart Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cart.map((product) => (
          <div
            key={product.id}
            className="relative flex flex-col bg-white border rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <Link to="/productdetail" state={{ product }} className="mt-2">
              <div className="h-40 w-full flex justify-center items-center mb-4 p-2">
                <img src={product.images[0]} alt={product.title} className="h-full object-contain hover:scale-105 transition-transform" />
              </div>
              <div className="text-center px-2">
                <h4 className="font-bold text-sm mb-1 h-10 overflow-hidden line-clamp-2 text-gray-800">
                  {product.title}
                </h4>
                <p className="text-gray-400 text-[10px] mb-2 font-black uppercase tracking-widest">
                  Unit Price: ₹{product.price}
                </p>
                <p className="font-black text-xl text-black mb-4">
                  ₹{(product.price * product.quantity).toFixed(2)}
                </p>
              </div>
            </Link>

            {/* Quantity & Action Controls */}
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex items-center justify-center gap-4 bg-gray-50 py-2 rounded-2xl">
                <button 
                  className="w-8 h-8 flex items-center justify-center bg-white border rounded-full font-black shadow-sm hover:bg-gray-100 active:scale-90 transition-all" 
                  onClick={() => decreaseQty(product.id)}
                > - </button>
                <span className="font-black text-lg">{product.quantity}</span>
                <button 
                  className="w-8 h-8 flex items-center justify-center bg-white border rounded-full font-black shadow-sm hover:bg-gray-100 active:scale-90 transition-all" 
                  onClick={() => increaseQty(product.id)}
                > + </button>
              </div>

              <div className="flex gap-2">
                <button 
                   className="flex-1 bg-gray-100 text-gray-600 text-[10px] font-black py-3 rounded-xl uppercase tracking-tighter hover:bg-gray-200 transition-all"
                   onClick={() => addToWishlist(product)}
                >
                  Save For Later
                </button>
                <button 
                  className="flex-1 bg-red-50 text-red-500 text-[10px] font-black py-3 rounded-xl uppercase tracking-tighter hover:bg-red-500 hover:text-white transition-all"
                  onClick={() => removeFromCart(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Section */}
      {cart.length !== 0 && (
        <div className="mt-12 p-10 bg-white rounded-[40px] border border-gray-100 shadow-2xl text-right relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gray-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
          
          <div className="flex flex-col gap-2 mb-6 relative z-10">
             <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Grand Total</span>
             <h2 className="text-6xl font-black text-gray-900 tracking-tighter">
               ₹ {total.toFixed(2)}
             </h2>
          </div>

          <button 
            className="w-full md:w-auto bg-black text-white px-16 py-5 rounded-full font-black text-xl hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200 relative z-10"
            onClick={() => navigate("/checkout",{state:{total:total}})}
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Saved For Later Section */}
      <Savetocart
        // cart={seelaterproduct} 
        // movetocarthandler={movetocarthandler} 
        // deletehandler={deletehandler} 
      />
    </div>
  );
}

export default Cart;