// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import CartProvider from "./context/CartContext";
import AuthProvider from "./context/AuthContext";
import WishListProvider from "./context/WishlistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <WishListProvider>
        <App />
      </WishListProvider>
    </CartProvider>
  </AuthProvider>,
);
