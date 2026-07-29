import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order; // Navigate karte waqt jo order bheja tha

  console.log("order",order)

  // Agar direct page access karein bina state ke
  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <p className="font-black italic text-xl uppercase">Order not found!</p>
        <button onClick={() => navigate(-1)} className="underline font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b pb-6">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 hover:text-orange-500 transition-colors"
          >
            ← Back to Orders
          </button>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">Order Details</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            ID: #{order.id} • Placed on {new Date(order.orderDate_and_time).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button className="border-2 border-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
          Download Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Items List */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
            Items ({order.items?.length || 0})
          </h3>
          
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 space-y-6 shadow-sm">
            {order.items?.map((item, index) => (
              <div key={index} className={`flex items-center gap-6 ${index !== 0 ? 'border-t pt-6' : ''}`}>
                {/* Product Image/Placeholder */}
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl italic font-black overflow-hidden">
                  {item.thumbnail ? (
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    item.title?.charAt(0) || "P"
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-black uppercase text-sm">{item.title || item.name}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                    Qty: {item.quantity || 1} • ₹{item.price}
                  </p>
                </div>
                
                <p className="font-black italic">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Summary & Address */}
        <div className="space-y-6">
          
          {/* Order Summary Card */}
          <div className="bg-black text-white rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between opacity-80">
                <span>Subtotal</span>
                <span>₹{Number(order.total).toFixed(2)}</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Shipping</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="flex justify-between opacity-80">
                <span>Tax (GST)</span>
                <span>₹0.00</span>
              </div>
              
              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between text-xl font-black italic">
                <span>Total</span>
                <span>₹{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
            
            {/* Click to Track Link */}
            <button 
              onClick={() => navigate(`/trackorder`, { state: { order } })}
              className="w-full mt-6 bg-white text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Track Journey →
            </button>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Delivery Address</h3>
            <p className="font-black text-sm uppercase leading-tight">Ashish Yadav</p>
            <p className="text-xs text-gray-500 font-medium mt-2 leading-relaxed">
              Indira Nagar No 3, Nahur Road,<br />
              Mulund West, Mumbai - 400080
            </p>
            
            {/* Status Badge inside details */}
            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
               <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
               <span className="text-[10px] font-black uppercase italic bg-gray-100 px-3 py-1 rounded-lg">
                 {order.status}
               </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;