const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// ek user ek baar me ek hi product wishlist kar sakta hai not 2 

wishlistSchema.index(
    {
        user: 1,
        product: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);