export const getProducts = async () => {
  try {
    // const res = await fetch("https://fakestoreapi.com/products");
   const res = await fetch("https://dummyjson.com/products")

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();
    return data;

  } catch (error) {
    throw error;
  }
};


//   changes 3 file me kiya hu dummy api ko hit karne k baad home.jsx,productcard,adminhome   api call karne ke baad jab data mila toh setproducts me data.products kiya hu aur image ko get karne k liye images kiya hu