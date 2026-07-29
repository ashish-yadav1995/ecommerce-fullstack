const mongoose  = require("mongoose");

 const orderItemSchema = new mongoose.Schema(
    {
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
       address:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"Address",
        type: String,
        trim: true,
        required:true
    },
   
     quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    paymentMethod:{
        type: String,
        required: true,
        trim: true
    }

    },
    {
        timestamps:true
    }
 )

 module.exports = mongoose.Model("Order",orderItemSchema)