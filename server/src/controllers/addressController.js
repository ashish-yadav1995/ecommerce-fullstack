const mongoose = require("mongoose");

const Address = require("../models/Address");

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.addAddress = asyncHandler(async (req, res) => {
  const {
    user,
    fullName,
    mobile,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    country,
    postalCode,
    addressType,
    isDefault,
  } = req.body;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(user)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Required Fields
  if (!fullName || !mobile || !addressLine1 || !city || !state || !postalCode) {
    throw new ApiError(400, "All required fields are mandatory");
  }

  // Check Existing Addresses
  const addressCount = await Address.countDocuments({ user });

  // First Address => Default
  let defaultAddress = isDefault;

  if (addressCount === 0) {
    defaultAddress = true;
  }

  // If new default selected then remove previous default
  if (defaultAddress) {
    await Address.updateMany(
      { user },
      {
        isDefault: false,
      },
    );
  }

  // Create Address
  const address = await Address.create({
    user,
    fullName,
    mobile,
    addressLine1,
    addressLine2,
    landmark,
    city,
    state,
    country,
    postalCode,
    addressType,
    isDefault: defaultAddress,
  });

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    data: address,
  });
});

exports.getAddresses = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  const addresses = await Address.find({ user: userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    message: "Addresses fetched successfully",
    totalAddresses: addresses.length,
    data: addresses,
  });
});

exports.updateAddress = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Address ID");
    }

    const address = await Address.findById(id);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    const {
        fullName,
        mobile,
        addressLine1,
        addressLine2,
        landmark,
        city,
        state,
        country,
        postalCode,
        addressType,
        isDefault,
    } = req.body;

    if (isDefault) {
        await Address.updateMany(
            { user: address.user },
            {
                isDefault: false,
            }
        );
    }

    address.fullName = fullName ?? address.fullName;
    address.mobile = mobile ?? address.mobile;
    address.addressLine1 = addressLine1 ?? address.addressLine1;
    address.addressLine2 = addressLine2 ?? address.addressLine2;
    address.landmark = landmark ?? address.landmark;
    address.city = city ?? address.city;
    address.state = state ?? address.state;
    address.country = country ?? address.country;
    address.postalCode = postalCode ?? address.postalCode;
    address.addressType = addressType ?? address.addressType;

    if (isDefault !== undefined) {
        address.isDefault = isDefault;
    }

    await address.save();

    res.status(200).json({
        success: true,
        message: "Address updated successfully",
        data: address,
    });

});

exports.deleteAddress = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Address ID");
    }

    const address = await Address.findById(id);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    await Address.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Address deleted successfully",
    });

});


exports.setDefaultAddress = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Address ID");
    }

    const address = await Address.findById(id);

    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    await Address.updateMany(
        { user: address.user },
        {
            isDefault: false,
        }
    );

    address.isDefault = true;

    await address.save();

    res.status(200).json({
        success: true,
        message: "Default address updated successfully",
        data: address,
    });

});