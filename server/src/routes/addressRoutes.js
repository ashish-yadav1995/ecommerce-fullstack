const express = require("express");

const router = express.Router();

const {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} = require("../controllers/addressController");

router.post("/", addAddress);

router.get("/:userId", getAddresses);

router.put("/:id", updateAddress);

router.delete("/:id", deleteAddress);

router.patch("/default/:id", setDefaultAddress);

module.exports = router;