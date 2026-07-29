import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser }  = useAuth();
  const allUser = localStorage.getItem("all_users")?
                JSON.parse(localStorage.getItem("all_users")):[];
  
  // Checkout page se jo 'finalOrder' bheja tha, wo yahan milega
  const order = location.state?.order;
  console.log("order",order)

  useEffect(()=>{
   const isexist = allUser.find((u)=> {
    return u.address === order.address 
  })
   if(!isexist){
     const modifiedUser = allUser.map((regisUser)=>{
         return regisUser.email === user.email ? 
         {...regisUser,
          address:order.address, 
          city: order.city , 
          zipcode:order.zipcode,
          orders : [
       {
      id: order.id,                                     
      date: order.date,
      orderDate_and_time: new Date().toISOString(),
      total: order.total,
      status: "PROCESSING",
      items:order.items.map((item)=>{
      return { name: item.title, qty: item.quantity, price: item.price, img: item.images[0]}
      })
       }
         ]
          } :regisUser;
     }) 

     
     setUser(
      {...user,
        address:order.address,
        city: order.city , 
        zipcode:order.zipcode,
           orders : [
       {
      id: order.id,                                     
      date: order.date,
      orderDate_and_time: new Date().toISOString(),
      total: order.total,
      status: "PROCESSING",
      items:order.items.map((item)=>{
      return { name: item.title, qty: item.quantity, price: item.price, img: item.images[0]}
      })
       }
         ]
      })
      
     localStorage.setItem("all_users", JSON.stringify(modifiedUser));
   }else{
    const modifiedUser = allUser.map((regisUser)=>{
          return regisUser.email == user.email ?  
          {
                ...regisUser,
                // orders:regisUser.orders? regisUser.orders.map((item)=>{}):""
                 orders:regisUser.orders? [...regisUser.orders,{ id: order.id,                                     
                date: order.date,
                orderDate_and_time: new Date().toISOString(),
                total: order.total,
                status: "PROCESSING",
                items:order.items.map((item)=>{
                return { name: item.title, qty: item.quantity, price: item.price, img: item.images[0]}
                })}]:[{
                   id: order.id,                                     
                   date: order.date,
                   orderDate_and_time: new Date().toISOString(),
                   total: order.total,
                   status: "PROCESSING",
                   items:order.items.map((item)=>{
                   return { name: item.title, qty: item.quantity, price: item.price, img: item.images[0]}
                   })
                }]
          }
          :regisUser;
    })

     setUser(
      {...user,
           orders:user.orders? [...user.orders,{ id: order.id,                                     
                date: order.date,
                orderDate_and_time: new Date().toISOString(),
                total: order.total,
                status: "PROCESSING",
                items:order.items.map((item)=>{
                return { name: item.title, qty: item.quantity, price: item.price, img: item.images[0]}
                })}]:[
       {
      id: order.id,                                     
      date: order.date,
      orderDate_and_time: new Date().toISOString(),
      total: order.total,
      status: "PROCESSING",
      items:order.items.map((item)=>{
      return { name: item.title, qty: item.quantity, price: item.price, img: item.images[0]}
      })
       }
         ]
      })

    localStorage.setItem("all_users", JSON.stringify(modifiedUser));
   }
  },[order]) // user ki dependency dalne k wajah se continiuos call ho raha tha

  // Agar koi direct is page par aaye bina order ke, toh use home bhej do
  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">No order details found!</h2>
        <button onClick={() => navigate("/")} className="bg-black text-white px-6 py-2 rounded-full">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        {/* 1. Animated Success Icon */}
        <div className="mb-8 relative inline-block">
          {/* Outer Ring Effect */}
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
          {/* Green Circle with Checkmark */}
          <div className="relative bg-green-500 text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-100">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* 2. Main Message */}
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Order Placed!</h1>
        {/* <p className="text-gray-500 font-medium mb-10">
          Hooray! Your order has been confirmed. <br /> It will reach you soon.
        </p> */}
        {/* User ka naam yahan display hoga */}
        <p className="text-gray-500 font-medium mb-10">
            Thank you, <span className="text-black font-bold">{order.fullname}</span>! <br /> 
              Your order has been confirmed and it's on the way.
        </p>

        {/* 3. Order Summary Card */}
        <div className="bg-gray-50 rounded-[35px] p-8 border border-gray-100 text-left mb-10 relative overflow-hidden">
          {/* Abstract background shape */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order ID</span>
            <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm text-sm">
              #{order.id}
            </span>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Amount</span>
            <span className="font-black text-2xl text-black">₹{Number(order.total).toFixed(2)}</span>
          </div>

          <div className="h-[1px] bg-gray-200 w-full mb-6 opacity-50"></div>

          <div className="space-y-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Delivery Address</p>
            <p className="text-gray-700 text-sm leading-relaxed font-medium">
              {order.address}
            </p>
            <p className="text-gray-400 text-[11px] mt-2 italic font-medium">
              Expected Delivery: 3-5 Business Days
            </p>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate("/")}
            className="w-full bg-black text-white px-10 py-5 rounded-full font-black text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            Continue Shopping
          </button>
          
          <button 
            className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-black transition-colors"
            onClick={() => window.print()} // Bonus: Order print karne ka option
          >
            Print Invoice
          </button>
        </div>

        {/* 5. Branding Footer */}
        <p className="mt-12 text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">
          Gemini Store • Thank You
        </p>
      </div>
    </div>
  );
}

export default OrderSuccess;