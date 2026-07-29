import React from "react";
import { BrowserRouter, Routes, Route ,Link, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import AdminHome from "./pages/Dashboard/AdminHome";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Ordersuccess from "./pages/Ordersuccess";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";
import TrackOrder from "./pages/TrackOrder";
import OrderDetails from "./pages/OrderDetails";

function App() {

   const { user, loading } = useAuth()
   console.log("user",user)
   
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />

          {user ?( 
            <>
            <Route path="/login" element={  
             <ProtectedRoute guestOnly={true}>  
             <Login />
            </ProtectedRoute>} />
            
            <Route path="/register" element={  
             <ProtectedRoute guestOnly={true}>  
             <Signup />
            </ProtectedRoute>} />
            </>
          ):(
            <>
              <Route path="/login" element={ <Login/>} />
              <Route path="/register" element={<Signup/>} />
            </>
          )}
          <Route path="/logout" element={
             <ProtectedRoute>  
             <Logout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
              <ProtectedRoute>  
             <Profile />
            </ProtectedRoute>
          } />
          <Route path="/productdetail" element={<ProductDetail />} />
          <Route path="/order-success" element={<Ordersuccess/>}/>
          <Route path = "/trackorder" element={<TrackOrder/>}/>
           <Route path = "/order-details/:id" element={<OrderDetails/>}/>
          <Route path="/checkout" element={
            <ProtectedRoute>  
              <Checkout/>
            </ProtectedRoute>
            } />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminHome />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;


// --------------------------------------------------------------



// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import { AuthProvider, useAuth } from '../src/pagesforpractice/Routing/AuthContext'
// import { PublicRoute, PrivateRoute } from '../src/pagesforpractice/Routing/RouteWrappers';
// import { Login, Register, About } from '../src/pagesforpractice/Routing/AuthPages';
// import { UserDetails, Product, Dashboard, Unauthorized } from '../src/pagesforpractice/Routing/PrivatePages';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   return (
//     <nav style={{ padding: '15px', background: '#333', color: '#fff' }}>
//       <Link to="/about" style={{color: 'white', marginRight: '10px'}}>About</Link>
//       {!user ? (
//         <>
//           <Link to="/login" style={{color: 'white', marginRight: '10px'}}>Login</Link>
//           <Link to="/register" style={{color: 'white'}}>Register</Link>
//         </>
//       ) : (
//         <>
//           <Link to="/user-details" style={{color: 'white', marginRight: '10px'}}>User Details</Link>
//           <Link to="/product" style={{color: 'white', marginRight: '10px'}}>Product</Link>
//           {user.role === 'admin' && <Link to="/dashboard" style={{color: 'gold', marginRight: '10px'}}>Dashboard</Link>}
//           <button onClick={logout} style={{ marginLeft: '15px' }}>Logout ({user.role})</button>
//         </>
//       )}
//     </nav>
//   );
// };

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           {/* 1. Public for Everyone */}
//           <Route path="/about" element={<About />} />
//           <Route path="/unauthorized" element={<Unauthorized />} />

//           {/* 2. Public Restricted (Only for Guests: Login/Register) */}
//           <Route element={<PublicRoute />}>
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//           </Route>

//           {/* 3. Private (Logged in User & Admin) */}
//           <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
//             <Route path="/user-details" element={<UserDetails />} />
//             <Route path="/product" element={<Product />} />
//           </Route>

//           {/* 4. Private (Only Admin) */}
//           <Route element={<PrivateRoute allowedRoles={['admin']} />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//           </Route>

//           {/* 404 Page */}
//           <Route path="*" element={<h2>404 - Page Not Found</h2>} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;  


// ------------------------------------------------------------------------------




// import React from 'react'
// import{BrowserRouter,Routes,Route,Link,Navigate} from "react-router-dom"
// import Login from './pagesforpractice/Routing/Login'
// import Signup from './pagesforpractice/Routing/Signup'
// import Userdetails from './pagesforpractice/Routing/Userdetails'
// import Product from './pagesforpractice/Routing/Product'
// import Adminhome from './pagesforpractice/Routing/Adminhome'
// import About from './pagesforpractice/Routing/About'
// import Navbar from './pagesforpractice/Routing/Navbar'
// import ProtectedRoute from './pagesforpractice/Routing/ProtectedRoute'

// function App() {

//  const saveduser = JSON.parse(localStorage.getItem("user_data"));
//  const loggedin = saveduser?saveduser.loggedin:false;
//   const usertype = saveduser?saveduser.usertype:"";
//   return (
//     <div>
//       <BrowserRouter>
//       <Navbar/>
//       <Routes>

//         {/* unauthorized user */}

//          {!loggedin && (
//           <>
//           <Route path='/login' element={<Login/>}/>
//          <Route path='/signup' element={<Signup/>}/>
//          <Route path='/' element={<Login/>}/>
//           </>
//          )}
        

//         {/* ProtectedRoute */}

//         <Route element={<ProtectedRoute/>}>
//         <Route path='/login' element={<Navigate to="/"/>}/>
//          <Route path='/signup' element={<Navigate to="/"/>}/>

//        {usertype!= "admin"?(

//         <>
//         <Route path='/' element={<Userdetails/>}/>
//         <Route path='/userdetails' element={<Userdetails/>}/>
//         <Route path='/product' element={<Product/>}/>
//         <Route path='/admin-dashboard' element={<Navigate to="/"/>}/>
//         </>
//        ):

//        <>
//         <Route path='/' element={<Adminhome/>}/>
//         <Route path='/userdetails' element={<Navigate to="/"/>}/>
//         <Route path='/product' element={<Navigate to="/"/>}/>
//         <Route path='/admin-dashboard' element={<Adminhome/>}/>
//        </>
//        }

   
//         </Route>

//          {/* public route */} 
//         <Route path='/about' element={<About/>}/> 

//         {/* for not match route */}
//         <Route path="/*" element={<h1>Page not found</h1>}/>
//       </Routes>
//       </BrowserRouter>
//     </div>
//   )
// }

// export default App