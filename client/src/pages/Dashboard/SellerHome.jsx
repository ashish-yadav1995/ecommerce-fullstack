import { useNavigate } from "react-router-dom";

function SellerHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            Seller Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your products and store
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Add Product */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-4xl mb-4">
              ➕
            </div>

            <h2 className="text-xl font-bold">
              Add Product
            </h2>

            <p className="text-gray-500 text-sm mt-2 mb-5">
              Add a new product to your store.
            </p>

            <button
              onClick={() => navigate("/seller/add-product")}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
            >
              Add Product
            </button>
          </div>

          {/* My Products */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-4xl mb-4">
              📦
            </div>

            <h2 className="text-xl font-bold">
              My Products
            </h2>

            <p className="text-gray-500 text-sm mt-2 mb-5">
              View and manage your products.
            </p>

            <button
              onClick={() => navigate("/seller/products")}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
            >
              My Products
            </button>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-4xl mb-4">
              🛒
            </div>

            <h2 className="text-xl font-bold">
              Orders
            </h2>

            <p className="text-gray-500 text-sm mt-2 mb-5">
              Manage orders for your products.
            </p>

            <button
              disabled
              className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SellerHome;