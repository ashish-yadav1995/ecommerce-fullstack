const mongoose = require("mongoose");

const Product = require("../models/Product");
const Category = require("../models/Category");

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    sku,
    price,
    discountPrice = req.body.discountPrice || 0,
    stock,
    category,
    images = [],
    isFeatured = req.body.isFeatured || false,
    isactive = req.body.isactive || true,
  } = req.body;

  // Required Field Validation
  if (!name) {
    throw new ApiError(400, "Product name is required");
  }

  if (!description) {
    throw new ApiError(400, "Product description is required");
  }

  if (!brand) {
    throw new ApiError(400, "Brand is required");
  }

  if (!sku) {
    throw new ApiError(400, "SKU is required");
  }

  if (price === undefined) {
    throw new ApiError(400, "Price is required");
  }

  if (stock === undefined) {
    throw new ApiError(400, "Stock is required");
  }

  if (!category) {
    throw new ApiError(400, "Category is required");
  }

  // Validate Category ObjectId
  if (!mongoose.Types.ObjectId.isValid(category)) {
    throw new ApiError(400, "Invalid Category ID");
  }

  // Check Category Exists
  const categoryExists = await Category.findById(category);

  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  // Check Duplicate SKU
  const existingSKU = await Product.findOne({ sku });

  if (existingSKU) {
    throw new ApiError(409, "SKU already exists");
  }

  // Business Validations
  if (price < 0) {
    throw new ApiError(400, "Price cannot be negative");
  }

  if (discountPrice < 0) {
    throw new ApiError(400, "Discount price cannot be negative");
  }

  if (discountPrice > price) {
    throw new ApiError(
      400,
      "Discount price cannot be greater than actual price",
    );
  }

  if (stock < 0) {
    throw new ApiError(400, "Stock cannot be negative");
  }

  if (!Array.isArray(images)) {
    throw new ApiError(400, "Images must be an array");
  }

  // Generate Slug
  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

  // Create Product
  const product = await Product.create({
    name,
    description,
    brand,
    sku,
    price,
    discountPrice,
    stock,
    category,
    images,
    slug,
    isFeatured,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

exports.getAllProducts = asyncHandler(async (req, res) => {

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query Parameters
    const {
        search,
        category,
        brand,
        featured,
        minPrice,
        maxPrice,
        sort,
    } = req.query;

    // Query Object
    const query = {
        isActive: true,
    };

    // Search by Product Name
    if (search) {
        query.name = {
            $regex: search,
            $options: "i",
        };
    }

    // Category Filter
    if (category) {
        query.category = category;
    }

    // Brand Filter
    if (brand) {
        query.brand = {
            $regex: brand,
            $options: "i",
        };
    }

    // Featured Filter
    if (featured !== undefined) {
        query.isFeatured = featured === "true";
    }

    // Price Filter
    if (minPrice || maxPrice) {

        query.price = {};

        if (minPrice) {
            query.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            query.price.$lte = Number(maxPrice);
        }

    }

    // Sorting
    let sortOption = { createdAt: -1 };

    switch (sort) {

        case "price":
            sortOption = { price: 1 };
            break;

        case "-price":
            sortOption = { price: -1 };
            break;

        case "name":
            sortOption = { name: 1 };
            break;

        case "-name":
            sortOption = { name: -1 };
            break;

        case "oldest":
            sortOption = { createdAt: 1 };
            break;

        case "latest":
            sortOption = { createdAt: -1 };
            break;

        default:
            sortOption = { createdAt: -1 };
    }

    // Total Products
    const totalProducts = await Product.countDocuments(query);

    // Fetch Products
    const products = await Product.find(query)
        .populate("category", "name")
        .select("-__v")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    // Response
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",

        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,

        hasNextPage: page < Math.ceil(totalProducts / limit),
        hasPreviousPage: page > 1,

        count: products.length,

        data: products,
    });

});

exports.getProductById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    const product = await Product.findById(id)
        .populate("category", "name")
        .select("-__v");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    res.status(200).json({
        success: true,
        data: product,
    });

});

exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const {
        name,
        description,
        brand,
        sku,
        price,
        discountPrice,
        stock,
        category,
        images,
        isFeatured,
        isActive,
    } = req.body;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    // Check Product Exists
    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Validate Category
    if (category) {

        if (!mongoose.Types.ObjectId.isValid(category)) {
            throw new ApiError(400, "Invalid Category ID");
        }

        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            throw new ApiError(404, "Category not found");
        }
    }

    // Check Duplicate SKU
    if (sku) {

        const existingSKU = await Product.findOne({
            sku,
            _id: { $ne: id },
        });

        if (existingSKU) {
            throw new ApiError(409, "SKU already exists");
        }
    }

    // Business Validation
    if (price !== undefined && price < 0) {
        throw new ApiError(400, "Price cannot be negative");
    }

    if (discountPrice !== undefined && discountPrice < 0) {
        throw new ApiError(400, "Discount price cannot be negative");
    }

    // Existing price use karo agar request me price nahi aaya
    const finalPrice = price ?? product.price;
    const finalDiscountPrice = discountPrice ?? product.discountPrice;

    if (finalDiscountPrice > finalPrice) {
        throw new ApiError(
            400,
            "Discount price cannot be greater than actual price"
        );
    }

    if (stock !== undefined && stock < 0) {
        throw new ApiError(400, "Stock cannot be negative");
    }

    if (images !== undefined && !Array.isArray(images)) {
        throw new ApiError(400, "Images must be an array");
    }

    // Update Slug
    let slug = product.slug;

    if (name) {
        slug = name
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
    }

    // Update Fields
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.brand = brand ?? product.brand;
    product.sku = sku ?? product.sku;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.stock = stock ?? product.stock;
    product.category = category ?? product.category;
    product.images = images ?? product.images;
    product.isFeatured = isFeatured ?? product.isFeatured;
    product.isActive = isActive ?? product.isActive;
    product.slug = slug;

    await product.save();

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
    });
});

exports.deleteProduct = asyncHandler(async (req, res) => {

    const { id } = req.params;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    // Check Product Exists
    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Already Deleted
    if (!product.isActive) {
        throw new ApiError(400, "Product is already deleted");
    }

    // Soft Delete
    product.isActive = false;

    await product.save();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });

});








