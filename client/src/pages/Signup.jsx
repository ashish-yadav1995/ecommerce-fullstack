// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Signup = () => {
//   const initialValue = {
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   };

//   const navigate = useNavigate();
//   // const [formData, setFormData] = useState(()=>{
//   //   const savedResiteredUser = localStorage.getItem("user01")
//   //   return savedResiteredUser ? JSON.parse(savedResiteredUser):initialValue;l
//   // });

//   const [formData, setFormData] = useState(initialValue);
//   const [showPassword, setShowPassword] = useState("");
//   const [error, setError] = useState({});
//   const [submit, setSubmit] = useState(false);

//   const handlechange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     setError(validateform(formData));
//     setSubmit(true);

//     //  const data =  validateform(formData);
//     //  console.log("error", error)
//     // const result = Object.values(data).every(value => value.trim() === "");
//     //  if(!result){
//     //    console.log("error")
//     //    setError(data)
//     //    return
//     //  }

//     //    console.log("form submitted")
//   };

//   const validateform = (formData) => {
//     const formError = {};
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//     if (!formData.fullName) {
//       formError.fullName = "fullname is required";
//     }
//     if (!formData.email) {
//       formError.email = "email is required";
//     } else if (!emailRegex.test(formData.email)) {
//       formError.email = "invalid email id";
//     } else {
//       const prevUserData = localStorage.getItem("user01")
//         ? JSON.parse(localStorage.getItem("user01"))
//         : [];
//       const emailExists = prevUserData.some(
//         (user) => user.email === formData.email,
//       );

//       if (emailExists) {
//         formError.email = "email id is already exist";
//       }
//     }
//     if (!formData.phone) {
//       formError.phone = "phone is required";
//     }
//     if (!formData.password) {
//       formError.password = "password is required";
//     } else if (formData.password.length < 4) {
//       formError.password = "password should be more than 4 character";
//     } else if (formData.password.length > 10) {
//       formError.password = "password should not be more than 10 character";
//     }
//     if (!formData.confirmPassword) {
//       formError.confirmPassword = "confirmPassword is required";
//     } else if (formData.password !== formData.confirmPassword) {
//       formError.confirmPassword = "confirmPassord not matched";
//     }
//     return formError;
//   };

//   useEffect(() => {
//     if (Object.keys(error).length === 0 && submit) {
//       const prevUserData = localStorage.getItem("user01")
//         ? JSON.parse(localStorage.getItem("user01"))
//         : [];
//       localStorage.setItem(
//         "user01",
//         JSON.stringify([...prevUserData, formData]),
//       );
//       navigate("/");
//     }
//   }, [error]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-[1.5rem] shadow-lg p-6 border border-gray-100">
//         {/* Header - More Compact */}
//         <div className="text-center mb-6">
//           <h2 className="text-2xl font-black text-black tracking-tight">
//             Create Account
//           </h2>
//           <p className="text-gray-400 text-sm font-medium">
//             Join MyStore today
//           </p>
//         </div>

//         <form className="space-y-3" onSubmit={handleSubmit}>
//           {/* Grid for Name and Phone - Reduces Height */}
//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Name"
//                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-sm font-medium"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handlechange}
//               />
//               {error.fullName && (
//                 <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 animate-pulse">
//                   {error.fullName}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 placeholder="Phone"
//                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-sm font-medium"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handlechange}
//               />
//               {error.phone && (
//                 <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 animate-pulse">
//                   {error.phone}
//                 </p>
//               )}{" "}
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               placeholder="name@example.com"
//               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-sm font-medium"
//               name="email"
//               value={formData.email}
//               onChange={handlechange}
//               //  autoComplete="off"
//               onFocus={(e) => e.target.removeAttribute("readonly")}
//               // onBlur={() => {
//               //   const prevUserData = localStorage.getItem("user01")
//               //     ? JSON.parse(localStorage.getItem("user01"))
//               //     : [];
//               //   const emailExists = prevUserData.some(
//               //     (user) => user.email === formData.email,
//               //   );

//               //   if (emailExists) {
//               //     return alert("email id is already exist");
//               //   }
//               // }}
//               readOnly
//             />
//             {error.email && (
//               <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 animate-pulse">
//                 {error.email}
//               </p>
//             )}
//           </div>

//           {/* Password Section - Compact with Eye Icon */}
//           <div className="relative">
//             <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">
//               Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="••••••••"
//               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-sm font-medium"
//               name="password"
//               value={formData.password}
//               onChange={handlechange}
//               autoComplete="off"
//             />
//             {error.password && (
//               <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 animate-pulse">
//                 {error.password}
//               </p>
//             )}
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-[32px] text-gray-400 hover:text-black"
//             >
//               {showPassword ? (
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M13.875 18.825A10.05 10.05 0 0112 19.5c-4.756 0-8.773-3.162-10.065-7.498a10.523 10.523 0 014.293-5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
//                   />
//                   <circle cx="12" cy="12" r="3" />
//                 </svg>
//               )}
//             </button>
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">
//               Confirm Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="••••••••"
//               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black focus:bg-white transition-all text-sm font-medium"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handlechange}
//             />
//             {error.confirmPassword && (
//               <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 animate-pulse">
//                 {error.confirmPassword}
//               </p>
//             )}
//           </div>

//           {/* Signup Button - Compact */}
//           <button
//             type="submit"
//             className="w-full bg-black text-white py-4 rounded-xl font-black text-base mt-2 hover:bg-gray-800 transition-all active:scale-[0.98]"
//           >
//             Create Account
//           </button>
//         </form>

//         <p className="text-center mt-4 text-xs text-gray-500 font-medium">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="text-black font-black hover:underline"
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
// const { allUser } = useAuth()

  const initialValue = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    adminCode: "", // Naya field toggle ke liye
  };

  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialValue);
  const [isAdmin, setIsAdmin] = useState(false); // User vs Admin toggle state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [submit, setSubmit] = useState(false);

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateform = (data) => {
    const formError = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!data.fullName) formError.fullName = "Full name is required";
    
    if (!data.email) {
      formError.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      formError.email = "Invalid email id";
    } else {
      const prevUserData = localStorage.getItem("all_users") ? JSON.parse(localStorage.getItem("all_users")) : [];
      const emailExists = prevUserData.some((user) => user.email === data.email);
      if (emailExists) formError.email = "Email id already exists";
    }

    if (!data.phone) formError.phone = "Phone is required";

    if (!data.password) {
      formError.password = "Password is required";
    } else if (data.password.length < 4) {
      formError.password = "Min 4 characters required";
    }

    if (!data.confirmPassword) {
      formError.confirmPassword = "Confirm password is required";
    } else if (data.password !== data.confirmPassword) {
      formError.confirmPassword = "Passwords do not match";
    }

    // Admin Specific Validation
    if (isAdmin && !data.adminCode) {
      formError.adminCode = "Admin secret code is required";
    }

    return formError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(validateform(formData));
    setSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(error).length === 0 && submit) {
      const prevUserData = localStorage.getItem("all_users") ? JSON.parse(localStorage.getItem("all_users")) : [];
      
      // Role bhi save kar lete hain logic ke liye
      const newUser = { ...formData, role: isAdmin ? "admin" : "user" };
      
      localStorage.setItem("all_users", JSON.stringify([...prevUserData, newUser]));
      navigate("/login");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      
      {/* 1. Toggle Button */}
      <div className="flex bg-white p-1 rounded-full shadow-md mb-6 w-64 border border-gray-200">
        <button
          type="button"
          onClick={() => { setIsAdmin(false); setError({}); }}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${!isAdmin ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
        >User</button>
        <button
          type="button"
          onClick={() => { setIsAdmin(true); setError({}); }}
          className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${isAdmin ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}
        >Admin</button>
      </div>

      {/* 2. Main Form Card */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className={`py-4 text-center text-white font-bold text-xl transition-colors ${isAdmin ? 'bg-red-600' : 'bg-blue-600'}`}>
          {isAdmin ? "Admin Registration" : "User Registration"}
        </div>

        <form className="p-6 space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Full Name</label>
              <input name="fullName" type="text" value={formData.fullName} onChange={handlechange} placeholder="Name" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm" />
              {error.fullName && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{error.fullName}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Phone</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handlechange} placeholder="Phone" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm" />
              {error.phone && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{error.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Email</label>
            <input name="email" type="email" value={formData.email} onChange={handlechange} placeholder="name@example.com" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm" />
            {error.email && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{error.email}</p>}
          </div>

          <div className="relative">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Password</label>
            <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handlechange} placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[30px] text-gray-400">
              {showPassword ? "👁️" : "🙈"}
            </button>
            {error.password && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{error.password}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-1">Confirm Password</label>
            <input name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handlechange} placeholder="••••••••" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black text-sm" />
            {error.confirmPassword && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{error.confirmPassword}</p>}
          </div>

          {/* Admin Code Field */}
          {isAdmin && (
            <div className="animate-pulse">
              <label className="block text-[10px] font-black uppercase text-red-600 mb-1 ml-1 text-center">Admin Secret Code</label>
              <input name="adminCode" type="text" value={formData.adminCode} onChange={handlechange} placeholder="Enter Code" className="w-full px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl focus:outline-none focus:border-red-600 text-sm font-bold text-red-600" />
              {error.adminCode && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 text-center">{error.adminCode}</p>}
            </div>
          )}

          <button type="submit" className={`w-full text-white py-3.5 rounded-xl font-black text-base mt-2 transition-all active:scale-95 shadow-md ${isAdmin ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            Register Account
          </button>
        </form>

        <p className="text-center pb-6 text-xs text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-black font-black hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;