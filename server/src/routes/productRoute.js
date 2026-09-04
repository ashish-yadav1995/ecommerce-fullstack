const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} = require("../controllers/productController");

router.post("/", protect, authorize("seller","admin"), createProduct);
router.get("/", protect, getAllProducts);
router.get("/:id", protect, getProductById);
router.put("/:id", protect, authorize("seller","admin"), updateProduct);
router.delete("/:id", protect, authorize("seller","admin"), deleteProduct);

module.exports = router;
    