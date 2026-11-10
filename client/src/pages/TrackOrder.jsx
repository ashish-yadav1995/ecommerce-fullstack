import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useOrder } from '../context/OrderContext';
import { useNavigate } from "react-router-dom";

const TrackOrder = () => {
  const location = useLocation();
  const { handleGetOrderById } = useOrder();
  const [order, setOrder] = useState(location.state?.order || null)  // jab user track journey button pe clcik karke aaye toh order track karne ke liye toh user ko fast data dikhega iske like navigate se data liya hua agar user url copy karke paste karega dusre tab me toh use order naame ke state me undefined milega toh isiko handle karne k liye api call kiya hu useEffect ke undar
  const { id } = useParams();
  const navigate = useNavigate();
  // Schema ke enum values ke sath status list ko match kiya gaya hai
  const statusList = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

  // Current status ka index nikalein
  const currentStepIndex = statusList.indexOf(order?.orderStatus || "Pending");

  const steps = [
    {
      label: "Order Pending / Placed",
      date: order?.createdAt ? new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Pending",
      completed: currentStepIndex >= 0
    },
    {
      label: "Confirmed",
      date: order?.confirmedTime || "",
      completed: currentStepIndex >= 1
    },
    {
      label: "Processing",
      date: order?.processingTime || "",
      completed: currentStepIndex >= 2
    },
    {
      label: "Shipped",
      date: order?.shippedTime || "",
      completed: currentStepIndex >= 3
    },
    {
      label: "Delivered",
      date: order?.deliveredTime || "",
      completed: currentStepIndex >= 4
    }
  ];

  useEffect(() => {

    if (order) return;
    const fetchOrder = async () => {
      try {
        const response = await handleGetOrderById(id)
        setOrder(response.data)
      } catch (error) {
        console.log("Error fetching order in component", error);
      }
    }

    if (!order) {
      fetchOrder()
    }
  }, [id, handleGetOrderById, order])

  // Agar order Cancel ho gaya ho toh uske liye alag UI ya message dikha sakte hain
  if (order?.orderStatus === "Cancelled") {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-red-600">Order Cancelled</h2>
        <p className="text-gray-500 text-xs uppercase tracking-widest">This order has been cancelled.</p>
      </div>
    );
  }

return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in slide-in-from-right-4 duration-700">
      
      {/* Main White Card Container */}
      <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm relative space-y-8">
        
        {/* Back Button - Ab card ke andar top par aayega */}
        <button
          onClick={() => navigate(-1)}
          className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
        >
          ← Back to My Orders
        </button>

        {/* Heading & Status */}
        <div className="text-center">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Track Your Package</h2>
          <p className="text-gray-400 text-xs font-black uppercase tracking-[0.3em] mt-2">
            Status: {order?.orderStatus || "Pending"}
          </p>
        </div>

        {/* Tracking Steps Timeline */}
        <div className="space-y-12 relative pt-4">
          {/* Vertical Line Dynamic Color */}
          <div className="absolute left-[15px] top-6 bottom-2 w-0.5 bg-gray-100"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex gap-8 items-start relative z-10">
              {/* Dot Logic */}
              <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-colors duration-500
                ${step.completed ? 'bg-black text-white' : 'bg-gray-200 text-transparent'}`}>
                {step.completed && <span className="text-[10px]">✓</span>}
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

        {/* Support Action inside the card or right below */}
        <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between mt-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Having trouble with your delivery?</p>
          <button className="text-[10px] font-black uppercase underline tracking-widest hover:text-orange-500 transition-colors">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
};

export default TrackOrder;