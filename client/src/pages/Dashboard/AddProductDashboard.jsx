import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productApi";

function AddProductDashboard() {
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Add Product</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">Add a new product to your store</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-8"
        >
          {/* Product Information */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5">Product Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {/* Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Enter brand"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="Example: IP15-128-BLK"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Category ID
                </label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Enter category ID"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 sm:mt-5">
              <label className="block text-xs sm:text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows="4"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5">Pricing & Stock</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {/* Price */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={form.discountPrice}
                  onChange={handleChange}
                  placeholder="₹ 0"
                  min="0"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5">Product Images</h2>

            <label className="block border-2 border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 text-center cursor-pointer hover:border-black transition">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">📷</div>
              <p className="font-semibold text-gray-700 text-xs sm:text-sm">
                Select Product Images
              </p>
              <p className="text-[11px] sm:text-sm text-gray-400 mt-1">
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
              <p className="text-xs sm:text-sm text-gray-600 mt-3 font-medium">
                {form.images.length} image(s) selected
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black text-white font-semibold text-xs sm:text-sm hover:bg-gray-800 disabled:opacity-50 transition shadow-md"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductDashboard;