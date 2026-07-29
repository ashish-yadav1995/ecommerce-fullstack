const express = require("express")

const router = express.Router()

const {addToCart,getCart,updateCart,removeCartItem,clearCart} = require("../controllers/cartController")

router.post("/",addToCart)
router.get("/:id",getCart)
router.put("/:id",updateCart)
router.delete("/:id",removeCartItem)
router.delete("/",clearCart)

module.exports = router