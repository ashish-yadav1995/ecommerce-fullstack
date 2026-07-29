import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TrackOrder = () => {
  const location = useLocation();
  const order = location.state?.order;

  console.log("order", order);

  // Status list ko UI ke order ke hisaab se rakhein
  // Index 0: Order Placed (Hamesha complete rahega)
  // Index 1: PROCESSING
  // Index 2: SHIPPED... and so on.
  const statusList = ["ORDER_PLACED", "PROCESSING", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED"];
  
  // Current status ka index nikalein. 
  // Agar status "PROCESSING" hai toh index 1 aayega.
  const currentStepIndex = statusList.indexOf(order?.status);

  const steps = [
    { 
      label: "Order Placed", 
      date: order?.orderDate_and_time ? new Date(order.orderDate_and_time).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Pending",
      // Order place hamesha true rahega
      completed: true 
    },
    { 
      label: "Processing", 
      date: order?.processingTime || "Pending",
      completed: currentStepIndex >= 1
    },
    { 
      label: "Shipped", 
      date: order?.shippedTime || "Pending",
      completed: currentStepIndex >= 2
    },
    { 
      label: "OUT FOR DELIVERY", 
      date: order?.outForDeliveryTime || "Pending",
      completed: currentStepIndex >= 3
    },
    { 
      label: "DELIVERED", 
      date: order?.deliveredTime || "Pending",
      completed: currentStepIndex >= 4
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10 animate-in slide-in-from-right-4 duration-700">
      <div className="text-center">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Track Your Package</h2>
        <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mt-2">
          Status: {order?.status}
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-sm relative">
        <div className="space-y-12 relative">
          {/* Vertical Line Dynamic Color */}
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex gap-8 items-start relative z-10">
              {/* Dot Logic */}
              <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-colors duration-500
                ${step.completed ? 'bg-black' : 'bg-gray-200'}`}>
                {step.completed && <span className="text-white text-[10px]">✓</span>}
              </div>
              
              <div className="flex-1">
                <h4 className={`text-sm font-black uppercase tracking-tight transition-colors duration-500 ${step.completed ? 'text-black' : 'text-gray-300'}`}>
                  {step.label}
                </h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">
                  {step.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Action */}
      <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Having trouble with your delivery?</p>
        <button className="text-[10px] font-black uppercase underline tracking-widest hover:text-orange-500 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default TrackOrder;