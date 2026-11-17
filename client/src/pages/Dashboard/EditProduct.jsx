import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProduct,
} from "../../services/productApi";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
  });

  // Get existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const product = response.product || response.data || response;

        setForm({
          name: product.name || "",
          description: product.description || "",
          brand: product.brand || "",
          price: product.price || "",
          discountPrice: product.discountPrice || "",
          stock: product.stock || "",
          category:
            product.category?._id ||
            product.category ||
            "",
        });
      } catch (error) {
        console.error("Get Product Error:", error);
        alert(
          error.response?.data?.message ||
          "Failed to load product"
        );
        navigate("/seller/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const response = await updateProduct(id, {
        name: form.name,
        description: form.description,
        brand: form.brand,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock),
        category: form.category,
      });

      console.log("Updated Product:", response);
      alert("Product updated successfully");
      navigate("/seller/products");
    } catch (error) {
      console.error("Update Product Error:", error);
      alert(
        error.response?.data?.message ||
        "Failed to update product"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="font-semibold text-sm">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans w-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Edit Product
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 font-medium">
            Update your product information
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-sm border border-gray-200 p-5 sm:p-8"
        >

          {/* Product Information */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5">
              Product Information
            </h2>

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
                rows="4"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-5">
              Pricing & Stock
            </h2>

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
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Discount Price */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-2">
                  Discount Price
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={form.discountPrice}
                  onChange={handleChange}
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
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

            </div>
          </div>

          {/* Existing Images Note */}
          <div className="mb-6 sm:mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <h2 className="text-base sm:text-lg font-bold mb-1">
              Product Images
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Existing product images are kept unchanged. Image replacement can be managed separately.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 font-semibold text-xs sm:text-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black text-white font-semibold text-xs sm:text-sm hover:bg-gray-800 disabled:opacity-50 transition shadow-md"
            >
              {updating ? "Updating..." : "Update Product"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProduct;