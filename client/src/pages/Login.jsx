// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useForm } from "react-hook-form";
// import { useEffect, useState } from "react";

// function Login() {
//   const { Login } = useAuth(); // ✅ correct function name
//   const navigate = useNavigate();
//   // const [showPassword, setShowPassword] = useState(false);
//   const [resisteredUser, setResisteredUser] = useState([]);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const handleLogin = (data) => {
//     // e.preventDefault();
//     debugger;
//     console.log("first");
//     const cleanData = {
//       username: data.email.trim().toLowerCase(),
//       password: data.password.trim(),
//     };
//     const { username, password } = cleanData;

//     const isUserRegistered = () => {};

//     Login(username, password);

//     if (username === "admin") {
//       navigate("/admin");
//     } else {
//       navigate("/");
//     }
//   };

//   useEffect(() => {
//     const isExistUser = localStorage.getItem("user01");
//     if (isExistUser) return setResisteredUser(JSON.parse(isExistUser));
//   }, []);

//   console.log("resisteredUser", resisteredUser);

//   return (
//     <div className="flex justify-center items-center h-[80vh] bg-gray-100">
//       <form
//         onSubmit={handleSubmit(handleLogin)}
//         className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

//         {/* Username */}
//         <input
//           type="text"
//           placeholder="email Id"
//           className="w-full border p-2 rounded mb-4"
//           // value={username}
//           // onChange={(e) => setUsername(e.target.value)}

//           {...register("email", {
//   required: "Email is required",
//   pattern: {
//     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//     message: "Invalid email address",
//   },
//   // YE HAI ASLI CHEEZ 👇
//   validate: (value) => {
//     debugger
//     const users = JSON.parse(localStorage.getItem("user01")) || [];
//     const isExist = users.some((u) => u.email === value);
    
//     // Agar user nahi mila, toh error message dikhao
//     return isExist || "Account not found! Please sign up first.";
//   }
// })}


//           // {...register("username", {
//           //   required: "Name is required",
//           //   onChange: (e) => {
//           //     let value = e.target.value;

//           //     // 1. Double spaces ko single space mein convert karega
//           //     value = value.replace(/\s\s+/g, " ");

//           //     // 2. Shuruat mein space allow nahi karega
//           //     if (value.startsWith(" ")) {
//           //       value = value.trimStart();
//           //     }

//           //     e.target.value = value;
//           //   },
//           //   pattern: {
//           //     value: /^[A-Za-z\s]+$/,
//           //     message: "Only letters allowed",
//           //   },
//           // })}
        
//           autoComplete="one-time-code"
//         />
//         {errors.email && (
//           <p style={{ color: "red" }}>{errors.email.message}</p>
//         )}

//         {/* Password */}
//         <input
//           //  type={showPassword ? "text" : "password"}
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 rounded mb-6"
//           // value={password}
//           // onChange={(e) => setPassword(e.target.value)}
//           {...register("password", {
//             required: "Password is required",
//             onChange: (e) => {
//               // Real-time input ko format karne ke liye
//               e.target.value = e.target.value.replace(/\s/g, "");
//             },
//             minLength: {
//               value: 6,
//               message: "Min 6 characters",
//             },
//             maxLength: {
//               value: 10,
//               message: "maximum 10 characters",
//             },
//           })}
//           autoComplete="one-time-code"
//         />
//         {/* <span
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   cursor: "pointer",
//                   color: "gray",
//                 }}
//               >
//                 {showPassword ? "🙈" : "👁"}
//               </span> */}

//         {errors.password && (
//           <p style={{ color: "red" }}>{errors.password.message}</p>
//         )}

//         {/* Button */}
//         <button
//           type="submit"
//           className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
//         >
//           Login
//         </button>

//         {/* Hint */}
//         <p className="text-sm text-gray-500 mt-4 text-center">
//           Try: <b>admin / 123456</b>
//         </p>
//       </form>
//     </div>
//   );
// }

// export default Login;



import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function Login() {
  const { Login } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false); // Toggle state
  const [showPassword, setShowPassword] = useState(false); // Password visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur" // Real-time validation ke liye
  });

  const handleLogin = (data) => {
    const users = JSON.parse(localStorage.getItem("all_users")) || [];
    debugger
    // Find User/Admin from localStorage
    const foundUser = users.find(u => u.email === data.email && u.password === data.password);
    if (foundUser) {
      // Admin verification logic
      if (isAdmin) {
        if (foundUser.role === "admin" && foundUser.adminCode === data.adminCode) {
          // Login(foundUser.email, foundUser.password,foundUser.role);
          Login(foundUser);
          navigate("/admin");
        } else {
          alert("Invalid Admin Code or Not an Admin Account!");
        }
      } else {
        // Normal User Login
        Login(foundUser);
        navigate("/");
      }
    } else {
      alert("Invalid Email or Password!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* 1. Toggle Switch (Matching Signup) */}
      <div className="flex bg-white p-1 rounded-full shadow-md mb-6 w-64 border border-gray-200">
        <button
          type="button"
          onClick={() => setIsAdmin(false)}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${!isAdmin ? 'bg-black text-white' : 'text-gray-500'}`}
        >User</button>
        <button
          type="button"
          onClick={() => setIsAdmin(true)}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${isAdmin ? 'bg-red-600 text-white' : 'text-gray-500'}`}
        >Admin</button>
      </div>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-white p-8 rounded-[1.5rem] shadow-xl w-full max-w-sm border border-gray-100"
      >
        <h2 className="text-2xl font-black mb-6 text-center tracking-tight">
          {isAdmin ? "Admin Login" : "User Login"}
        </h2>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Email Address</label>
          <input
            type="text"
            placeholder="name@example.com"
            className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black transition-all"
            {...register("email", {
              required: "Email is required",
              validate: (value) => {
                const users = JSON.parse(localStorage.getItem("all_users")) || [];
                return users.some((u) => u.email === value) || "Account not found!";
              }
            })}
          />
          {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4 relative">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black transition-all"
            {...register("password", { required: "Password is required" })}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-gray-400"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
          {errors.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.password.message}</p>}
        </div>

        {/* 2. Admin Code Field (Sirf Admin mode mein dikhega) */}
        {isAdmin && (
          <div className="mb-6 animate-pulse">
            <label className="block text-[10px] font-black uppercase text-red-600 mb-1 ml-1">Secret Admin Code</label>
            <input
              type="text"
              placeholder="Enter Admin Code"
              className="w-full border border-red-200 p-3 rounded-xl focus:outline-none focus:border-red-600 bg-red-50 font-bold text-red-600"
              {...register("adminCode", { required: isAdmin ? "Code is required" : false })}
            />
            {errors.adminCode && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.adminCode.message}</p>}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-4 rounded-xl font-black text-white transition-all active:scale-95 shadow-lg ${isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'}`}
        >
          Sign In
        </button>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account? <span className="text-black font-bold cursor-pointer hover:underline" onClick={() => navigate("/register")}>Register</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
