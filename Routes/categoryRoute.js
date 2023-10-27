const express = require("express");

// category Services
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  imagePrecessing,
} = require("../Services/categoryService");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const AuthService = require("../Services/authService");
const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

// category Routes
router.post(
  "/",
  AuthService.auth,
  AuthService.allowedTo("admin", "manager"),
  uploadCategoryImage,
  imagePrecessing,
  createCategoryValidator,
  createCategory
);

// get all categories
router.get("/", getCategories);

// get speciific category
router.get("/:id", getCategoryValidator, getCategory);

// update category
router.put(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo("admin", "manager"),
  uploadCategoryImage,
  imagePrecessing,
  updateCategoryValidator,
  updateCategory
);
// delete category
router.delete(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo("admin"),
  deleteCategoryValidator,
  deleteCategory
);
// Nested Route (subCategories)
router.use("/:categoryId/subcategories", subCategoryRoute);
module.exports = router;
