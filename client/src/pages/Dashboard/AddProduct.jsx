// import { useState } from "react";

// function AddProduct({ onAdd }) {
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!title || !price) return;

//     const newProduct = {
//       title,
//       price: Number(price),
//       image: "https://via.placeholder.com/150",
//     };

//     onAdd(newProduct);

//     setTitle("");
//     setPrice("");
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4"
//     >
//       <input
//         type="text"
//         placeholder="Product name"
//         className="border p-2 rounded w-full"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       <input
//         type="number"
//         placeholder="Price"
//         className="border p-2 rounded w-full"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//       />

//       <button
//         type="submit"
//         className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//       >
//         Add
//       </button>
//     </form>
//   );
// }

// export default AddProduct;

// =================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productApi";

function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    sku: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImages = (e) => {
    setForm((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("brand", form.brand);
      formData.append("sku", form.sku);
      formData.append("price", form.price);
      formData.append("discountPrice", form.discountPrice || 0);
      formData.append("stock", form.stock);
      formData.append("category", form.category);

      form.images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await createProduct(formData);

      console.log("Product Created:", response);

      alert("Product created successfully!");

      navigate("/seller");
    } catch (error) {
      console.error("Create Product Error:", error);

      alert(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Add Product</h1>

          <p className="text-gray-500 mt-1">Add a new product to your store</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          {/* Product Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-5">Product Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Brand
                </label>

                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Enter brand"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-semibold mb-2">SKU</label>

                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="Example: IP15-128-BLK"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category ID
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Enter category ID"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="5"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-5">Pricing & Stock</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Price */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="₹ 0"
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Discount Price
                </label>

                <input
                  type="number"
                  name="discountPrice"
                  value={form.discountPrice}
                  onChange={handleChange}
                  placeholder="₹ 0"
                  min="0"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-5">Product Images</h2>

            <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-black transition">
              <div className="text-4xl mb-3">📷</div>

              <p className="font-semibold text-gray-700">
                Select Product Images
              </p>

              <p className="text-sm text-gray-400 mt-1">
                You can select multiple images
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {/* Selected Images */}
            {form.images.length > 0 && (
              <p className="text-sm text-gray-600 mt-3">
                {form.images.length} image(s) selected
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
