// // import {Link}  from 'react-router-dom'

// // function Navbar(){
// //      return(
// //            <nav style={{display:"flex", gap:"20px"}}>
// //               <Link to="/">Home</Link>
// //               <Link to="/cart">Cart</Link>
// //               <Link to="/login">Login</Link>
// //               <Link to="/admin">Admin</Link>
// //             </nav>
// //      )
// // }

// // export default Navbar;

// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";

// function Navbar() {
//   const { cart } = useCart();

//   const totalItems = cart.reduce(
//     (acc, item) => acc + item.quantity,
//     0
//   );

//   return (
//     <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">

//       {/* Logo */}
//       <h1 className="text-xl font-bold tracking-wide">
//         MyStore
//       </h1>

//       {/* Links */}
//       <div className="flex gap-6 items-center">
//         <Link className="hover:text-gray-300" to="/">
//           Home
//         </Link>

//         <Link className="hover:text-gray-300" to="/cart">
//           Cart ({totalItems})
//         </Link>

//         <Link className="hover:text-gray-300" to="/login">
//           Login
//         </Link>

//         <Link className="hover:text-gray-300" to="/admin">
//           Admin
//         </Link>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  return (
    // 'sticky top-0' navbar ko chipkayega, 'z-50' use dusre elements ke upar rakhega
    <nav className="sticky top-0 z-50 bg-black text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <h1 className="text-xl font-bold tracking-wide">
        <Link to="/">MyStore</Link>
      </h1>

      {/* Links */}
      <div className="flex gap-6 items-center">
        <Link className="hover:text-blue-400 transition-colors" to="/">
          Home
        </Link>

        <Link
          className="hover:text-blue-400 transition-colors flex items-center gap-1"
          to="/cart"
        >
          Cart
          {/* Badge style for cart items */}
          <span className="bg-blue-600 text-[10px] px-2 py-0.5 rounded-full">
            {totalItems}
          </span>
        </Link>

        {!user ? (
          <>
            <Link className="hover:text-blue-400 transition-colors" to="/login">
              Login
            </Link>

            <Link
              className="hover:text-blue-400 transition-colors"
              to="/register"
            >
              Register
            </Link>
          </>
        ) : user.role == "admin" ? (
          <>
            <Link className="hover:text-blue-400 transition-colors" to="/admin">
              Admin
            </Link>
             <Link
              className="hover:text-blue-400 transition-colors"
              to="/logout"
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              className="hover:text-blue-400 transition-colors"
              to="/profile"
            >
              Profile
            </Link>
            <Link
              className="hover:text-blue-400 transition-colors"
              to="/logout"
            >
              Logout
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
