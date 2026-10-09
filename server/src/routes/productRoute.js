const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productController");
const upload = require("../middlewares/upload");

router.post( "/", protect, authorize("seller", "admin"), upload.array("images", 5), createProduct);
router.get("/", getAllProducts);
router.get("/my-products", protect, authorize("seller"), getMyProducts)
router.get("/:id", protect, getProductById);
router.put("/:id", protect, authorize("seller", "admin"), updateProduct);
router.delete("/:id", protect, authorize("seller", "admin"), deleteProduct);

module.exports = router;
