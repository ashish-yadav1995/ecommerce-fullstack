// import { useLocation, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useCart } from "../context/CartContext";
// import { useWishList } from "../context/WishlistContext";
// import Loader from "../components/Loader";
// import { getProductById } from "../services/productApi";

// function ProductDetail() {
//   // const { id } = useParams(); // URL se ID lega (e.g. /product/1)
//   const { addToCart } = useCart();
//   const [product, setProduct] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const location = useLocation();
//   const { Wishlist, addToWishlist, removeFromWishlist } = useWishList();

//   const  id  = location.state.product._id;

//   console.log("id", id);

//   useEffect(() => {
//     getProductDetail();
//   },[]);

//   const getProductDetail = async () => {
//     try {
//       const data = await getProductById(id)
//       setProduct(data.product)
//       console.log("data======",data)
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <h2>Error: {error}</h2>;

//   return (
//     <div className="max-w-7xl mx-auto p-6 md:p-12">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
//         {/* --- LEFT SIDE: IMAGE GALLERY --- */}
//         <div className="space-y-4">
//           <div className="bg-gray-100 rounded-2xl p-8 flex justify-center overflow-hidden">
//             <img
//               src={product.images[0]}
//               alt={product.name}
//               className="hover:scale-110 transition-transform duration-500 w-full h-[400px] object-contain"
//             />
//           </div>
//           {/* Thumbnails */}
//           <div className="flex gap-3 overflow-x-auto pb-2">
//             {product.images.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 className="w-20 h-20 border rounded-lg p-2 cursor-pointer hover:border-black"
//               />
//             ))}
//           </div>
//         </div>

//         {/* --- RIGHT SIDE: PRODUCT INFO --- */}
//         <div className="flex flex-col">
//           <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mb-2">
//             {product.brand}
//           </p>
//           <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
//             {product.name}
//           </h1>

//           {/* Rating & Stock Badge */}
//           <div className="flex items-center gap-4 mb-6">
//             <div className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
//               {product.averageRating} ★
//             </div>
//             <span className="text-gray-500 text-sm font-medium">|</span>
//             <span
//               className={`text-sm font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
//             >
//               {product.isActive} ({product.stock} items left)
//             </span>
//           </div>

//           <p className="text-gray-600 text-lg mb-8 leading-relaxed italic border-l-4 border-gray-200 pl-4">
//             "{product.description}"
//           </p>

//           {/* Pricing Section */}
//           <div className="mb-8">
//             <div className="flex items-center gap-3">
//               <span className="text-4xl font-black text-gray-900">
//                 ₹ {product.price}
//               </span>
//               <span className="text-lg text-red-500 font-semibold bg-red-50 px-2 rounded">
//                 -{product.discountPercentage}% OFF
//               </span>
//             </div>
//             <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4 mb-10">
//             <button
//               onClick={() => addToCart(product)}
//               className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition active:scale-95 shadow-lg"
//             >
//               Add to Cart
//             </button>

//             {Wishlist.some((item) => item.id === product._id) ? (
//               /* 1. AGAR EXIST KARTA HAI (RED HEART) */
//               <button
//                 className="px-6 py-4 border-2 border-red-200 rounded-xl bg-red-50 text-red-500 transition"
//                 onClick={() => removeFromWishlist(product._id)}
//               >
//                 ❤️
//               </button>
//             ) : (
//               /* 2. AGAR EXIST NAHI KARTA (KHHALI HEART) */
//               <button
//                 className="px-6 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition"
//                 onClick={() => addToWishlist(product)}
//               >
//                 ♡
//               </button>
//             )}
//           </div>

//           {/* Additional Specs Table */}
//           <div className="grid grid-cols-2 gap-4 text-sm border-t pt-8">
//             <div className="text-gray-500">
//               Warranty:{" "}
//               <span className="text-black font-medium">
//                 {product.warrantyInformation}
//               </span>
//             </div>
//             <div className="text-gray-500">
//               Shipping:{" "}
//               <span className="text-black font-medium">
//                 {product.shippingInformation}
//               </span>
//             </div>
//             <div className="text-gray-500">
//               Return Policy:{" "}
//               <span className="text-black font-medium">
//                 {product.returnPolicy}
//               </span>
//             </div>
//             <div className="text-gray-500">
//               SKU: <span className="text-black font-medium">{product.sku}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- BOTTOM SECTION: REVIEWS --- */}
//       <div className="mt-20 border-t pt-10">
//         <h2 className="text-3xl font-bold mb-10">
//           Customer Stories ({product?.numReviews?.length})
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {product.numReviews.map((rev, index) => (
//             <div
//               key={index}
//               className="bg-gray-50 p-6 rounded-2xl border border-transparent hover:border-gray-200 transition"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <p className="font-bold text-gray-900">{rev.reviewerName}</p>
//                   <p className="text-xs text-gray-400">
//                     {new Date(rev.date).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="text-yellow-500 font-bold">
//                   {"★".repeat(rev.averageRating)}
//                 </div>
//               </div>
//               <p className="text-gray-700 text-sm italic leading-snug">
//                 "{rev.comment}"
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductDetail;


// ================================================


import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishlistContext";
import Loader from "../components/Loader";
import { getProductById } from "../services/productApi";

function ProductDetail() {
  const { id: paramId } = useParams(); // Safe URL Param fallback
  const location = useLocation();
  const { addToCart } = useCart();
  const { Wishlist, addToWishlist, removeFromWishlist } = useWishList();

  // State Management
  const [product, setProduct] = useState(null); // Fix 1: Object state initialization
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Safe Product ID extraction (supports direct page refresh)
  const id = location.state?.id || paramId;

  useEffect(() => {
    if (id) {
      getProductDetail();
    } else {
      setError("Product ID not found.");
      setLoading(false);
    }
  }, [id]);

  const getProductDetail = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      // Backend response handle karna
      setProduct(data.product || data);
    } catch (error) {
      setError(error.message || "Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-600">{error || "Product not found"}</p>
      </div>
    );
  }

  // Calculate Discount Percentage safely
  const discountPercent =
    product.discountPrice && product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* --- LEFT SIDE: IMAGE GALLERY --- */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-2xl p-8 flex justify-center overflow-hidden">
            <img
              src={product.images?.[selectedImage] || "https://via.placeholder.com/400"}
              alt={product.name || "Product Image"}
              className="hover:scale-110 transition-transform duration-500 w-full h-[400px] object-contain"
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 border rounded-lg p-2 cursor-pointer hover:border-black transition ${
                    selectedImage === index ? "border-black border-2" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT SIDE: PRODUCT INFO --- */}
        <div className="flex flex-col">
          <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mb-2">
            {product.brand || "Brand"}
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {product.name}
          </h1>

          {/* Rating & Stock Badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {product.averageRating ? product.averageRating.toFixed(1) : "0.0"} ★
            </div>
            <span className="text-gray-500 text-sm font-medium">|</span>
            <span
              className={`text-sm font-bold ${
                product.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? `In Stock (${product.stock} items left)` : "Out of Stock"}
            </span>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed italic border-l-4 border-gray-200 pl-4">
            "{product.description}"
          </p>

          {/* Pricing Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-gray-900">
                ₹ {(product.discountPrice || product.price)?.toLocaleString("en-IN")}
              </span>
              {discountPercent > 0 && (
                <span className="text-lg text-red-500 font-semibold bg-red-50 px-2 rounded">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                MRP: ₹ {product.price?.toLocaleString("en-IN")}
              </span>
            )}
            <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-10">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition active:scale-95 shadow-lg"
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            {Wishlist?.some((item) => item._id === product._id) ? (
              <button
                className="px-6 py-4 border-2 border-red-200 rounded-xl bg-red-50 text-red-500 transition"
                onClick={() => removeFromWishlist(product._id)}
              >
                ❤️
              </button>
            ) : (
              <button
                className="px-6 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition"
                onClick={() => addToWishlist(product)}
              >
                ♡
              </button>
            )}
          </div>

          {/* Additional Specs Table */}
          <div className="grid grid-cols-2 gap-4 text-sm border-t pt-8">
            <div className="text-gray-500">
              Category:{" "}
              <span className="text-black font-medium">
                {product.category?.name || "N/A"}
              </span>
            </div>
            <div className="text-gray-500">
              SKU: <span className="text-black font-medium">{product.sku || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: REVIEWS --- */}
      <div className="mt-20 border-t pt-10">
        <h2 className="text-3xl font-bold mb-6">
          Customer Stories ({product.numReviews || 0})
        </h2>

        {/* Fix 2: Safe Reviews Mapping (Handling Array vs Number) */}
        {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.reviews.map((rev, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-2xl border border-gray-100 transition hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-gray-900">{rev.reviewerName || "Customer"}</p>
                    <p className="text-xs text-gray-400">
                      {rev.date ? new Date(rev.date).toLocaleDateString() : ""}
                    </p>
                  </div>
                  <div className="text-yellow-500 font-bold">
                    {"★".repeat(rev.rating || 5)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic leading-snug">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-6 rounded-xl inline-block text-gray-500 italic">
            No detailed reviews written yet. Average Rating:{" "}
            <span className="font-bold text-gray-800">
              {product.averageRating ? product.averageRating.toFixed(1) : "0.0"} ★
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;

