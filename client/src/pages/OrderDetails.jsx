// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { useOrder } from '../context/OrderContext';

// const OrderDetails = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { handleGetOrderById } = useOrder();
//   // const order = state?.order; // Navigate karte waqt jo order bheja tha
//   const { id } = useParams()
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//   const fetchOrder = async () => {
//     try {
//       const response = await handleGetOrderById(id);
//       // Agar backend se response.data aa raha hai ya direct response aa raha hai check kar lein
//       setOrder(response.data); 
//     } catch (error) {
//       console.log("Error fetching order in component", error);
//     }
//   };

//   if (id) {
//     fetchOrder();
//   }
// }, [id, handleGetOrderById]); 


//   if (!order) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center space-y-4">
//         <p className="font-black italic text-xl uppercase">Order not found!</p>
//         <button onClick={() => navigate(-1)} className="underline font-bold">Go Back</button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

//       {/* Header */}
//       <div className="flex justify-between items-end border-b pb-6">
//         <div>
//           <button
//             onClick={() => navigate(-1)}
//             className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 hover:text-orange-500 transition-colors"
//           >
//             ← Back to Orders
//           </button>
//           <h2 className="text-3xl font-black uppercase italic tracking-tighter">Order Details</h2>
//           <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
//             ID: #{order._id} • Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
//           </p>
//         </div>
//         <button className="border-2 border-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
//           Download Invoice
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

//         {/* Left: Items List */}
//         <div className="md:col-span-2 space-y-4">
//           <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
//             Items ({order.orderItems?.length || 0})
//           </h3>

//           <div className="bg-white border border-gray-100 rounded-[2rem] p-6 space-y-6 shadow-sm">
//             {order.orderItems?.map((item, index) => (
//               <div key={index} className={`flex items-center gap-6 ${index !== 0 ? 'border-t pt-6' : ''}`}>
//                 {/* Product Image/Placeholder */}
//                 <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl italic font-black overflow-hidden">
//                   {item.thumbnail ? (
//                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                   ) : (
//                     item.name?.charAt(0) || "P"
//                   )}
//                 </div>

//                 <div className="flex-1">
//                   <h4 className="font-black uppercase text-sm">{item.title || item.name}</h4>
//                   <p className="text-xs text-gray-400 font-bold uppercase mt-1">
//                     Qty: {item.quantity || 1} • ₹{item.totalPrice}
//                   </p>
//                 </div>

//                 <p className="font-black italic">₹{(item.totalPrice * (item.quantity || 1)).toFixed(2)}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right: Summary & Address */}
//         <div className="space-y-6">

//           {/* Order Summary Card */}
//           <div className="bg-black text-white rounded-[2rem] p-8 shadow-xl">
//             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">Order Summary</h3>
//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between opacity-80">
//                 <span>Subtotal</span>
//                 <span>₹{Number(order.totalPrice).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between opacity-80">
//                 <span>Shipping</span>
//                 <span className="text-green-400">FREE</span>
//               </div>
//               <div className="flex justify-between opacity-80">
//                 <span>Tax (GST)</span>
//                 <span>₹0.00</span>
//               </div>

//               <div className="border-t border-white/10 pt-4 mt-4 flex justify-between text-xl font-black italic">
//                 <span>Total</span>
//                 <span>₹{Number(order.totalPrice).toFixed(2)}</span>
//               </div>
//             </div>

//             {/* Click to Track Link */}
//             <button
//               onClick={() => navigate(`/trackorder/${order._id}`, { state: { order } })}
//               className="w-full mt-6 bg-white text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
//             >
//               Track Journey →
//             </button>
//           </div>

//           {/* Delivery Address Card */}
//           <div className="bg-white border border-gray-100 rounded-[2rem] p-8">
//             <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Delivery Address</h3>
//             <p className="font-black text-sm uppercase leading-tight">{order.shippingAddress.fullName}</p>
//             <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
//               {/* Indira Nagar No 3, Nahur Road,<br />
//               Mulund West, Mumbai - 400080 */}
//               {`${order.shippingAddress.addressLine1, ",", order.shippingAddress.landmark, ",", order.shippingAddress.city, ",", order.shippingAddress.state, ",", order.shippingAddress.postalCode}`}
//             </p>

//             {/* Status Badge inside details */}
//             <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
//               <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
//               <span className="text-[10px] font-black uppercase italic bg-gray-100 px-3 py-1 rounded-lg">
//                 {order.orderStatus}
//               </span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;


// ===============================================

// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { useOrder } from '../context/OrderContext';

// const OrderDetails = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const { handleGetOrderById } = useOrder();
//   const { id } = useParams();

//   // Pehle state se order lene ki koshish karein, agar na ho toh null rakhein taaki useEffect API call kare
//   const [order, setOrder] = useState(state?.order || null);

//   useEffect(() => {
//     // Agar state mein order pehle se hai, toh baar-baar API call karne ki zaroorat nahi hai
//     if (order) return;

//     const fetchOrder = async () => {
//       try {
//         const response = await handleGetOrderById(id);
//         setOrder(response.data || response);
//       } catch (error) {
//         console.log("Error fetching order in component", error);
//       }
//     };

//     if (id) {
//       fetchOrder();
//     }
//   }, [id, handleGetOrderById, order]);

//   if (!order) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center space-y-4">
//         <p className="font-black italic text-xl uppercase">Order not found!</p>
//         <button onClick={() => navigate(-1)} className="underline font-bold">Go Back</button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">

//       {/* Header */}
//       <div className="flex justify-between items-end border-b pb-6">
//         <div>
//           <button
//             onClick={() => navigate(-1)}
//             className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 hover:text-orange-500 transition-colors"
//           >
//             ← Back to Orders
//           </button>
//           <h2 className="text-3xl font-black uppercase italic tracking-tighter">Order Details</h2>
//           <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
//             ID: #{order._id} | Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
//           </p>
//         </div>
//         <button className="border-2 border-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
//           Download Invoice
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

//         {/* Left: Items List */}
//         <div className="md:col-span-2 space-y-4">
//           <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
//             Items ({order.orderItems?.length || 0})
//           </h3>

//           <div className="bg-white border border-gray-100 rounded-[2rem] p-6 space-y-6 shadow-sm">
//             {order.orderItems?.map((item, index) => (
//               <div>
//                 <div key={index} className={`flex items-center gap-6 ${index !== 0 ? 'border-t pt-6' : ''}`}>
//                   {/* Product Image/Placeholder */}
//                   <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl italic font-black overflow-hidden">
//                     {item.image ? (
//                       <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
//                     ) : (
//                       (item.title || item.name)?.charAt(0) || "P"
//                     )}
//                   </div>

//                   <div className="flex-1">
//                     <h4 className="font-black uppercase text-sm">{item.title || item.name}</h4>
//                     <p className="text-xs text-gray-400 font-bold uppercase mt-1">
//                       Qty: {item.quantity || 1} | Price: ₹{item.price || item.totalPrice}
//                     </p>
//                   </div>

//                   <p className="font-black italic">₹{((item.price || item.totalPrice) * (item.quantity || 1)).toFixed(2)}</p>
//                 </div>
//                 {/* Item ke neeche review button */}
//                 <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
//                   <span className="text-[10px] font-bold text-gray-400 uppercase">
//                     {order.orderStatus === "Delivered" ? "Delivered successfully" : "Delivery in progress"}
//                   </span>

//                   {order.orderStatus === "Delivered" && (
//                     <button
//                       onClick={() => {
//                         // Yahan aap review modal open kar sakte hain ya review page par navigate kar sakte hain
//                         console.log("Rate product:", item._id);
//                       }}
//                       className="bg-black text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 transition-colors"
//                     >
//                       ⭐ Rate & Review
//                     </button>
//                   )}
//                 </div>
//               </div>

//             ))}
//           </div>

//         </div>

//         {/* Right: Summary & Address */}
//         <div className="space-y-6">

//           {/* Order Summary Card */}
//           <div className="bg-black text-white rounded-[2rem] p-8 shadow-xl">
//             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">Order Summary</h3>
//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between opacity-80">
//                 <span>Subtotal</span>
//                 <span>₹{Number(order.totalPrice).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between opacity-80">
//                 <span>Shipping</span>
//                 <span className="text-green-400">FREE</span>
//               </div>
//               <div className="flex justify-between opacity-80">
//                 <span>Tax (GST)</span>
//                 <span>₹0.00</span>
//               </div>

//               <div className="border-t border-white/10 pt-4 mt-4 flex justify-between text-xl font-black italic">
//                 <span>Total</span>
//                 <span>₹{Number(order.totalPrice).toFixed(2)}</span>
//               </div>
//             </div>

//             {/* Click to Track Link */}
//             <button
//               onClick={() => navigate(`/trackorder/${order._id}`, { state: { order } })}
//               className="w-full mt-6 bg-white text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
//             >
//               Track Journey →
//             </button>
//           </div>

//           {/* Delivery Address Card */}
//           <div className="bg-white border border-gray-100 rounded-[2rem] p-8">
//             <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Delivery Address</h3>
//             <p className="font-black text-sm uppercase leading-tight">{order.shippingAddress?.fullName}</p>
//             <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
//               {order.shippingAddress ?
//                 [
//                   order.shippingAddress.addressLine1,
//                   order.shippingAddress.landmark,
//                   order.shippingAddress.city,
//                   order.shippingAddress.state,
//                   order.shippingAddress.postalCode
//                 ].filter(Boolean).join(", ")
//                 : "Address not available"}
//             </p>

//             {/* Status Badge inside details */}
//             <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
//               <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
//               <span className="text-[10px] font-black uppercase italic bg-gray-100 px-3 py-1 rounded-lg">
//                 {order.orderStatus}
//               </span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;

// =========================================================



import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useReview } from "../context/ReviewContext";
import { useAuth } from "../context/AuthContext";


const OrderDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { handleGetOrderById } = useOrder();
  const { id } = useParams();
  const [isEditReviewOpen, setIsEditReviewOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [order, setOrder] = useState(state?.order || null);

  // Review Modal States (UI Only)
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedItemForReview, setSelectedItemForReview] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [productId, setProductId] = useState(order?.orderItems?.[0]?.product || null); // Default to first product if available
  const { handleAddReviews, reviews, setReviews, handleGetSinglegProductReviews, handleUpdateReviews, handleDeleteReviews } = useReview();
   const { user } = useAuth();

  console.log("Order in OrderDetails component:", productId);

  useEffect(() => {
    if (order) return;

    const fetchOrder = async () => {
      try {
        const response = await handleGetOrderById(id);
        setOrder(response.data || response);
      } catch (error) {
        console.log("Error fetching order in component", error);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, handleGetOrderById, order]);


  useEffect(() => {
    if (productId) {
      handleGetSinglegProductReviews(productId);
    }
  }, [productId]);

  const EditReview = (reviewData) => {
    setSelectedReview(reviewData);
    setIsEditReviewOpen(true); // Yahan state true hoti hai toh modal khul jata hai
  };

  const DeleteReview = async (reviewId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this review?");
      if (!confirmDelete) return;

      const success = await handleDeleteReviews(reviewId);
      console.log("Review deleted successfully:", success);

    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const cutomerReviews = async (product) => {
    try {
      const response = await handleAddReviews({ product, rating, comment });

      console.log(response);
      alert("Review submitted successfully! (UI Only)");
      setIsReviewOpen(false);
      setComment("");
      setProductId("");

    } catch (error) {
      console.log("error to addReview", error)
    }
  }

  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <p className="font-black italic text-xl uppercase">Order not found!</p>
        <button onClick={() => navigate(-1)} className="underline font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700 relative">

      {/* Header */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 hover:text-orange-500 transition-colors"
          >
            ← Back to Orders
          </button>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Order Details</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            ID: #{order._id} | Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button className="border-2 border-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
          Download Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left: Items List */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
            Items ({order.orderItems?.length || 0})
          </h3>

          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 space-y-6 shadow-sm">
            {order.orderItems?.map((item, index) => {

              {/* Maan lijiye aapke paas review data hai jo is item se match karta hai */ }
              {/* Aap ise apne state ya API data ke mutabiq replace kar sakte hain */ }
              // Yahan current user ki ID bhi check karein taaki sirf aapka hi review dikhe
              const existingReview = reviews?.find(
                (rev) =>
                  (rev.product === item.product || rev.product?._id === item.product) &&
                  (rev.user?._id === user._id || rev.user === user._id)
              );

              return (
                <div key={index} className={`flex flex-col gap-4 ${index !== 0 ? 'border-t pt-6' : ''}`}>
                  <div className="flex items-center gap-6">
                    {/* Product Image/Placeholder */}
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl italic font-black overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
                      ) : (
                        (item.title || item.name)?.charAt(0) || "P"
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-black uppercase text-sm">{item.title || item.name}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                        Qty: {item.quantity || 1} | Price: ₹{item.price || item.totalPrice}
                      </p>
                    </div>

                    <p className="font-black italic">₹{((item.price || item.totalPrice) * (item.quantity || 1)).toFixed(2)}</p>
                  </div>

                  {/* Rate & Review Button / Review Card Section (Only shows if order is Delivered) */}
                  {order.orderStatus === "Delivered" && (
                    <div className="pt-2">
                      {existingReview ? (
                        /* --- REVIEW ALREADY GIVEN: Show Review Card with Edit & Delete Buttons --- */
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-yellow-500 font-bold text-sm">
                                {"⭐".repeat(existingReview.rating)}
                              </span>
                              <span className="text-[10px] font-black uppercase text-gray-400">Your Review</span>
                            </div>
                            <p className="text-xs text-gray-700 font-medium">"{existingReview.comment}"</p>
                          </div>

                          {/* Edit & Delete Action Buttons */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => EditReview(existingReview)}
                              className="px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-gray-100 transition-colors shadow-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => DeleteReview(existingReview._id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* --- NO REVIEW GIVEN YET: Show Rate & Review Button --- */
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedItemForReview(item);
                              setIsReviewOpen(true);
                              setProductId(item.product);
                            }}
                            className="bg-black text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-500 transition-colors"
                          >
                            ⭐ Rate & Review Product
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Summary & Address */}
        <div className="space-y-6">

          {/* Order Summary Card */}
          <div className="bg-black text-white rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between opacity-80">
                <span>Subtotal</span>
                <span>₹{Number(order.totalPrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Shipping</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Tax (GST)</span>
                <span>₹0.00</span>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between text-xl font-black italic">
                <span>Total</span>
                <span>₹{Number(order.totalPrice).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/trackorder/${order._id}`, { state: { order } })}
              className="w-full mt-6 bg-white text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Track Journey →
            </button>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Delivery Address</h3>
            <p className="font-black text-sm uppercase leading-tight">{order.shippingAddress?.fullName}</p>
            <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
              {order.shippingAddress ?
                [
                  order.shippingAddress.addressLine1,
                  order.shippingAddress.landmark,
                  order.shippingAddress.city,
                  order.shippingAddress.state,
                  order.shippingAddress.postalCode
                ].filter(Boolean).join(", ")
                : "Address not available"}
            </p>

            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
              <span className="text-[10px] font-black uppercase italic bg-gray-100 px-3 py-1 rounded-lg">
                {order.orderStatus}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= REVIEW MODAL (UI ONLY) ================= */}
      {isReviewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-300">

            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Rate & Review</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {selectedItemForReview?.title || selectedItemForReview?.name}
                </p>
              </div>
              <button
                onClick={() => setIsReviewOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-black hover:bg-black hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Stars selection UI */}
            <div className="space-y-2 text-center py-2">
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Select Rating</p>
              <div className="flex justify-center gap-2 text-3xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    {star <= rating ? "⭐" : "☆"}
                  </span>
                ))}
              </div>
            </div>

            {/* Review Textarea */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Write Your Review</label>
              <textarea
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this product?"
                className="w-full border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-black font-medium resize-none"
              ></textarea>
            </div>

            {/* Submit Button (UI Only) */}
            <button
              onClick={() => {
                cutomerReviews(productId)
                // alert("Review submitted successfully! (UI Only)");
                // setIsReviewOpen(false);
                // setComment("");
              }}
              className="w-full bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-orange-500 transition-colors shadow-lg"
            >
              Submit Review
            </button>

          </div>
        </div>
      )}

      {/* ================= EDIT REVIEW MODAL ================= */}

      <EditReviewModal
        isOpen={isEditReviewOpen}
        onClose={() => setIsEditReviewOpen(false)}
        review={selectedReview}
        handleUpdateReviews={handleUpdateReviews}
      />
    </div>
  );
};



const EditReviewModal = ({ isOpen, onClose, review, handleUpdateReviews }) => {
  // Local state for form inputs
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // Jab bhi modal khule ya review data change ho, purana data fields me pre-fill kar do
  useEffect(() => {
    if (review) {
      setRating(review.rating || 5);
      setComment(review.comment || "");
    }
  }, [review]);


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating review with ID:", review._id, "Rating:", rating, "Comment:", comment);
      await handleUpdateReviews(review._id, { rating, comment });
      onClose();
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md relative shadow-2xl">

        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">Edit Review</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Rating Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
              <option value={4}>⭐⭐⭐⭐ (4/5)</option>
              <option value={3}>⭐⭐⭐ (3/5)</option>
              <option value={2}>⭐⭐ (2/5)</option>
              <option value={1}>⭐ (1/5)</option>
            </select>
          </div>

          {/* Comment Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Write your review here..."
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Close (X) Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
        >
          ✕
        </button>

      </div>
    </div>
  );
};

export default OrderDetails;