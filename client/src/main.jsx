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
import OrderProvider from "./context/OrderContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishListProvider>
         <OrderProvider>
          <App />
        </OrderProvider>
        </WishListProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
  