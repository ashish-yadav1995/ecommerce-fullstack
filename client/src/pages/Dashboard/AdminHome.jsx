import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productApi";
import AddProductDashboard from "./AddProductDashboard";
import myimg from  "../../assets/images/tshirt.webp"

function AdminHome() {
  const [products, setProducts] = useState([]);

  console.log("=================================")

  useEffect(() => {
    // loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getAllProducts();
    setProducts(data.products); // ✅ fix
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addProduct = (newProduct) => {
    setProducts((prev) => [
      ...prev,
      { ...newProduct, id: Date.now() },
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* Add Product */}
      <AddProductDashboard onAdd={addProduct} />

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={p.images ? p.images[0]:myimg}
              className="h-32 w-full object-contain mb-3"
            />

            <h4 className="font-medium mb-2">
              {p.title}
            </h4>

            <p className="font-bold mb-3">
              ₹ {p.price}
            </p>

            <button
              onClick={() => deleteProduct(p.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminHome;