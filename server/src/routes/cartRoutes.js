const express = require("express")

const router = express.Router()

const {addToCart,getCart,updateCart,removeCartItem,clearCart} = require("../controllers/cartController")

const {protect} = require("../middlewares/authMiddleware")

// req.user_Id is available in the request object after authentication middleware that why we don't need to pass user_Id in the request body or params.

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:id", protect, updateCart);
router.delete("/:id", protect, removeCartItem);
router.delete("/", protect, clearCart);

module.exports = router