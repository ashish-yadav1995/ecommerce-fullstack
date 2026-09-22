import { useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/authApi";

function VerifyOtp() {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  // const email = searchParams.get("email");  

  const location  = useLocation();

  const email = location.state?.email || "";  // best way bcoz of privacy

  console.log("email00000000", email)

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp) {
      setError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      await verifyOTP(email, otp);

      setMessage("Account verified successfully. Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setMessage("");

    try {
      setResendLoading(true);

      const response = await resendOTP(email);

      setMessage(response.message || "OTP sent successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-black text-center mb-2">Verify OTP</h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          OTP has been sent to
          <br />
          <span className="font-bold text-black">{email}</span>
        </p>

        <form onSubmit={handleVerifyOTP}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 6 digit OTP"
            className="w-full border border-gray-200 p-3 rounded-xl text-center tracking-[0.5em] placeholder:tracking-normal text-lg font-bold focus:outline-none focus:border-black"
          />

          {error && (
            <p className="text-sm text-red-500 font-bold text-center mt-2">
              {error}
            </p>
          )}

          {message && (
            <p className="text-sm text-green-600 font-bold text-center mt-2">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-black mt-5 disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resendLoading}
          className="w-full text-sm font-bold text-blue-600 mt-5 hover:underline disabled:opacity-50"
        >
          {resendLoading ? "Sending..." : "Resend OTP"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full text-sm text-gray-500 mt-3 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;

// ==============================================================

// import { useState, useRef } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { verifyOTP, resendOTP } from "../services/authApi";

// function VerifyOtp() {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const email = searchParams.get("email");

//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);

//   // 6 Boxes ke focus ko control karne ke liye refs
//   const inputRefs = useRef([]);

//   // Jab user kisi box me type karega
//   const handleInputChange = (e, index) => {
//     const val = e.target.value.replace(/\D/g, "");

//     // Naya OTP string banayein
//     let currentOtp = otp.split("");
//     // Ensure array is 6 length
//     while (currentOtp.length < 6) currentOtp.push("");

//     currentOtp[index] = val;
//     const newOtpString = currentOtp.join("");
//     setOtp(newOtpString);

//     // Agar value enter hui hai toh automatic next box par focus shift karein
//     if (val && index < 5) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   // Backspace dabane par piche wale box par focus le jane ke liye
//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       if (!otp[index] && index > 0) {
//         // Agar current box khali hai, toh piche wale box par jayein aur use clear karein
//         inputRefs.current[index - 1].focus();

//         let currentOtp = otp.split("");
//         currentOtp[index - 1] = "";
//         setOtp(currentOtp.join(""));
//       }
//     }
//   };

//   // Paste integration taaki agar user pura 6-digit code copy karke paste kare toh chal jaye
//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData
//       .getData("text")
//       .replace(/\D/g, "")
//       .slice(0, 6);
//     setOtp(pastedData);

//     // Last index par ya jitne character paste huye hain us hisab se focus adjust karein
//     const focusIndex = pastedData.length === 6 ? 5 : pastedData.length;
//     inputRefs.current[focusIndex]?.focus();
//   };

//   const handleVerifyOTP = async (e) => {
//     e.preventDefault();

//     setError("");
//     setMessage("");

//     if (!otp) {
//       setError("OTP is required");
//       return;
//     }

//     if (otp.length !== 6) {
//       setError("OTP must be 6 digits");
//       return;
//     }

//     try {
//       setLoading(true);

//       await verifyOTP(email, otp);

//       setMessage("Account verified successfully. Please login.");

//       setTimeout(() => {
//         navigate("/login");
//       }, 1000);
//     } catch (error) {
//       setError(error.response?.data?.message || "Invalid or expired OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setError("");
//     setMessage("");
//     setOtp(""); // Purana OTP clear kar dein resend par

//     try {
//       setResendLoading(true);

//       const response = await resendOTP(email);

//       setMessage(response.message || "OTP sent successfully.");
//       // Pehle box par focus wapas layein
//       inputRefs.current[0]?.focus();
//     } catch (error) {
//       setError(error.response?.data?.message || "Unable to resend OTP");
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 antialiased">
//       {/* Modern Premium Card Container */}
//       <div className="bg-white w-full max-w-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 transition-all duration-300">
//         {/* Header Block */}
//         <div className="flex flex-col items-center mb-8">
//           <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
//             Verify OTP
//           </h2>
//           <p className="text-sm text-gray-400 text-center max-w-xs leading-relaxed">
//             OTP has been sent to
//             <span className="block font-semibold text-gray-800 mt-1 break-all bg-gray-50 px-2.5 py-1 rounded-md text-xs border border-gray-100 inline-block">
//               {email}
//             </span>
//           </p>
//         </div>

//         {/* Verification Form */}
//         <form onSubmit={handleVerifyOTP} className="space-y-6">
//           {/* Modern 6-Digit Split Grid Container */}
//           <div>
//             <div
//               className="flex justify-between items-center gap-2 sm:gap-3"
//               onPaste={handlePaste}
//             >
//               {Array.from({ length: 6 }).map((_, index) => (
//                 <input
//                   key={index}
//                   ref={(el) => (inputRefs.current[index] = el)}
//                   type="text"
//                   inputMode="numeric"
//                   maxLength={1}
//                   value={otp[index] || ""}
//                   onChange={(e) => handleInputChange(e, index)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                   className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold border-2 border-gray-200 rounded-2xl bg-gray-50/50 text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-all duration-150 shadow-sm"
//                   placeholder="•"
//                 />
//               ))}
//             </div>

//             {/* Error Message Notification */}
//             {error && (
//               <p className="text-xs text-red-500 font-medium text-center mt-4 bg-red-50 py-2 rounded-xl border border-red-100">
//                 {error}
//               </p>
//             )}

//             {/* Success Message Notification */}
//             {message && (
//               <p className="text-xs text-emerald-600 font-medium text-center mt-4 bg-emerald-50 py-2 rounded-xl border border-emerald-100">
//                 {message}
//               </p>
//             )}
//           </div>

//           {/* Primary Submit Button */}
//           <button
//             type="submit"
//             disabled={loading || otp.length < 6}
//             className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-black active:scale-[0.99] transition-all duration-150 shadow-md shadow-gray-900/10 disabled:opacity-40 disabled:hover:bg-gray-900 disabled:pointer-events-none mt-2"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-2">
//                 <svg
//                   className="animate-spin h-4 w-4 text-white"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                   />
//                 </svg>
//                 Verifying...
//               </span>
//             ) : (
//               "Verify OTP"
//             )}
//           </button>
//         </form>

//         {/* Footer Navigation Buttons */}
//         <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3.5 text-center">
//           <button
//             type="button"
//             onClick={handleResendOTP}
//             disabled={resendLoading}
//             className="text-xs font-semibold text-gray-600 hover:text-black transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1 mx-auto"
//           >
//             {resendLoading ? "Sending..." : "Resend OTP"}
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/login")}
//             className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors inline-flex items-center justify-center gap-1 mx-auto"
//           >
//             Back to Login
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VerifyOtp;
