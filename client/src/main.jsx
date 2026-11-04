import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import CartProvider from "./context/CartContext";
import AuthProvider from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext"; 
import OrderProvider from "./context/OrderContext";
import ReviewProvider from "./context/ReviewContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider> 
          <OrderProvider>
            <ReviewProvider> 
              <App />
            </ReviewProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
