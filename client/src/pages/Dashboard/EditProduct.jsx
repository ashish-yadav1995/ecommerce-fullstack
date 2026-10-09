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
        const response = await getProductById(id,form);

        const product = response.product;

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-semibold">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            Edit Product
          </h1>

          <p className="text-gray-500 mt-1">
            Update your product information
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >

          {/* Product Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-5">
              Product Information
            </h2>

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
                rows="5"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-5">
              Pricing & Stock
            </h2>

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
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Discount Price */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Discount Price
                </label>

                <input
                  type="number"
                  name="discountPrice"
                  value={form.discountPrice}
                  onChange={handleChange}
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
                  min="0"
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

            </div>
          </div>

          {/* Existing Images */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">
              Product Images
            </h2>

            <p className="text-sm text-gray-500">
              Existing product images are kept unchanged.
              Image replacement will be added separately.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={() => navigate("/seller/products")}
              className="px-6 py-3 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updating}
              className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
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

