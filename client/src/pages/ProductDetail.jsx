import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishlistContext";

function ProductDetail() {
  const { id } = useParams(); // URL se ID lega (e.g. /product/1)
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { Wishlist, addToWishlist, removeFromWishlist } = useWishList();

  const { product } = location.state;

  console.log("first", Wishlist);
  // API se single product fetch karne ka logic
  //   useEffect(() => {
  //     fetch(`https://dummyjson.com/products/${id}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setProduct(data);
  //         setLoading(false);
  //       });
  //   }, [id]);

  //   if (loading) return <div className="h-screen flex justify-center items-center font-bold text-2xl">Loading Product...</div>;
  //   if (!product) return <div className="text-center mt-20">Product Not Found!</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* --- LEFT SIDE: IMAGE GALLERY --- */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-2xl p-8 flex justify-center overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.title}
              className="hover:scale-110 transition-transform duration-500 w-full h-[400px] object-contain"
            />
          </div>
          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img}
                className="w-20 h-20 border rounded-lg p-2 cursor-pointer hover:border-black"
              />
            ))}
          </div>
        </div>

        {/* --- RIGHT SIDE: PRODUCT INFO --- */}
        <div className="flex flex-col">
          <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mb-2">
            {product.brand}
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {product.title}
          </h1>

          {/* Rating & Stock Badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {product.rating} ★
            </div>
            <span className="text-gray-500 text-sm font-medium">|</span>
            <span
              className={`text-sm font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
            >
              {product.availabilityStatus} ({product.stock} items left)
            </span>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed italic border-l-4 border-gray-200 pl-4">
            "{product.description}"
          </p>

          {/* Pricing Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-gray-900">
                ₹ {product.price}
              </span>
              <span className="text-lg text-red-500 font-semibold bg-red-50 px-2 rounded">
                -{product.discountPercentage}% OFF
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-10">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition active:scale-95 shadow-lg"
            >
              Add to Cart
            </button>

            {Wishlist.some((item) => item.id === product.id) ? (
              /* 1. AGAR EXIST KARTA HAI (RED HEART) */
              <button
                className="px-6 py-4 border-2 border-red-200 rounded-xl bg-red-50 text-red-500 transition"
                onClick={() => removeFromWishlist(product.id)}
              >
                ❤️
              </button>
            ) : (
              /* 2. AGAR EXIST NAHI KARTA (KHHALI HEART) */
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
              Warranty:{" "}
              <span className="text-black font-medium">
                {product.warrantyInformation}
              </span>
            </div>
            <div className="text-gray-500">
              Shipping:{" "}
              <span className="text-black font-medium">
                {product.shippingInformation}
              </span>
            </div>
            <div className="text-gray-500">
              Return Policy:{" "}
              <span className="text-black font-medium">
                {product.returnPolicy}
              </span>
            </div>
            <div className="text-gray-500">
              SKU: <span className="text-black font-medium">{product.sku}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: REVIEWS --- */}
      <div className="mt-20 border-t pt-10">
        <h2 className="text-3xl font-bold mb-10">
          Customer Stories ({product.reviews.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {product.reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-2xl border border-transparent hover:border-gray-200 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-gray-900">{rev.reviewerName}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(rev.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-yellow-500 font-bold">
                  {"★".repeat(rev.rating)}
                </div>
              </div>
              <p className="text-gray-700 text-sm italic leading-snug">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
