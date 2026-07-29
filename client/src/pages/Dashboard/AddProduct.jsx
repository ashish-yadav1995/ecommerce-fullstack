// import { useState } from "react";


// function AddProduct({ onAdd }) {
//     const [title, setTitle] = useState("");
//     const [price, setPrice] = useState("");
  
//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const newProduct = {
//       title,
//       price: Number(price),
//       image: "https://via.placeholder.com/150",
//     };

//     onAdd(newProduct);

//     setTitle("");
//     setPrice("");
//   };

//   return (
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Product name"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
  
//       <input
//         type="number"
//         placeholder="Price"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//       />

//       <button type="submit">Add Product</button>
//     </form>
//   );
// }

// export default AddProduct;

import { useState } from "react";

function AddProduct({ onAdd }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !price) return;

    const newProduct = {
      title,
      price: Number(price),
      image: "https://via.placeholder.com/150",
    };

    onAdd(newProduct);

    setTitle("");
    setPrice("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-4"
    >
      <input
        type="text"
        placeholder="Product name"
        className="border p-2 rounded w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        className="border p-2 rounded w-full"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Add
      </button>
    </form>
  );
}

export default AddProduct;