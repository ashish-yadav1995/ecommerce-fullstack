// export const getProducts = async () => {
//   try {
//     // const res = await fetch("https://fakestoreapi.com/products");
//    const res = await fetch("https://dummyjson.com/products")

//     if (!res.ok) {
//       throw new Error("Failed to fetch products");
//     }

//     const data = await res.json();
//     return data;

//   } catch (error) {
//     throw error;
//   }
// };

//   changes 3 file me kiya hu dummy api ko hit karne k baad home.jsx,productcard,adminhome   api call karne ke baad jab data mila toh setproducts me data.products kiya hu aur image ko get karne k liye images kiya hu\

// =====================================================================================


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials:true,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT automatically attach karega
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;

//2 tarike hote hai 1st Cookie-based JWT Authentication and 2nd Header-based JWT Authentication (Jise Bearer Token Approach bhi kehte hain).Header-based (ya LocalStorage/SessionStorage-based) JWT authentication aata hai.

// Ek Line Me Summary:Cookie-based = HttpOnly Cookie Storage (Fully Secure Browser Level)Header-based = LocalStorage / Bearer Token (JavaScript Level Storage)