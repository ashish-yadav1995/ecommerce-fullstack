const express = require("express")

const router = express.Router()

const {addToCart,getCart,updateCart,removeCartItem,clearCart} = require("../controllers/cartController")

const {protect} = require("../middlewares/authMiddleware")

// router.post("/",addToCart)
// router.get("/:id",getCart)
// router.put("/:id",updateCart)
// router.delete("/:id",removeCartItem)
// router.delete("/",clearCart)

// req.user_Id is available in the request object after authentication middleware that why we don't need to pass user_Id in the request body or params.

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:productId", protect, updateCart);
router.delete("/:productId", protect, removeCartItem);
router.delete("/", protect, clearCart);

module.exports = router