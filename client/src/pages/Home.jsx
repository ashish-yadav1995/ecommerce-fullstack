import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [page, setPage] = useState(1);
  const perPage = 8; // 👈 test ke liye chhota rakho

  // API call
  useEffect(() => {
    fetchProducts();
  }, []);

  
  

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = products.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
      setFiltered(result);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, products]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // categories
  const categories = [...new Set(products.map((p) => p.category))];

  // filter logic
  const finalProducts = (search ? filtered : products).filter((p) =>
    selectedCategory === "all" ? true : p.category === selectedCategory
  );

  console.log("finalProducts",finalProducts)

  // pagination logic
  const start = (page - 1) * perPage;
  const paginatedProducts = finalProducts.slice(start, start + perPage);

  // UI states
  if (loading) return <Loader />;
  
  if (error) return <h2>Error: {error}</h2>;

  return (
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Products</h1>

    {/* 🔍 Search + Category */}
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search product..."
        className="border p-2 rounded w-full"
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <select
        className="border p-2 rounded"
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          setPage(1);
        }}
      >
        <option value="all">All</option>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
    </div>

    {/* 🛒 Products Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {paginatedProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>

    {/* 🔥 Pagination */}
    {finalProducts.length > perPage && (
      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>

        <span className="font-semibold">Page {page}</span>

        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={start + perPage >= finalProducts.length}
        >
          Next
        </button>
      </div>
    )}
  </div>
);
}

export default Home;
