const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} = require("../controllers/addressController");

// router.post("/", addAddress);

// router.get("/:userId", getAddresses);

// router.put("/:id", updateAddress);

// router.delete("/:id", deleteAddress);

// router.patch("/default/:id", setDefaultAddress);



router.post("/", protect, addAddress);

router.get("/", protect, getAddresses); // no need to pass userId in the request body or params because req.user_Id is available in the request object after authentication middleware.

router.put("/:id", protect, updateAddress);

router.delete("/:id", protect, deleteAddress);

router.patch("/default/:id", protect, setDefaultAddress);

module.exports = router;