// Ye 3 imports kyu?
// 1.
// const Category = require("../models/Category");

// MongoDB se baat karega.

// 2.
// const asyncHandler = require("../middlewares/asyncHandler");

// Ab hume

// try {

// }catch(err){

// }

// kabhi nahi likhna padega.

// Ye automatically error ko

// next(error)

// bhej dega.

// Industry me ye bahut common hai.

// 3.
// const ApiError = require("../utils/ApiError");

// Ab hum

// res.status(400).json(...)

// baar-baar nahi likhenge.

// Instead

// throw new ApiError(400,"Category already exists");

// Ye professional approach hai.

// =============================================================================

const Category = require("../models/Category");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  if (!description) {
    throw new ApiError(400, "Category description is required");
  }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");

  const category = await Category.create({
    name,
    description,
    slug,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  console.log(categories);

  res.status(200).json({
    success: true,
    message: "categories fetched successfully",
    data: categories,
  });
});

exports.getCategoryById = asyncHandler(async (req, res) => {
  // const category = await Category.findById(req.params.id);
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: category,
  });
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.name = name;
  category.description = description;

  if (name) {
    category.slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  }

  const updatedCategory = await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  });
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});
