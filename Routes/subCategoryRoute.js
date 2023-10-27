const express = require("express");
const {
  creatSubCategory,
  getSubCategory,
  getSubCategories,
  deleteSubCategory,
  updateSubCategory,
  setcategoryIdToBody,
  creatFilterObj,
} = require("../Services/subCategoryService");
const {
  createSubcategoryValidator,
  getSubcategoryValidator,
  ubdateSubcategoryValidator,
  deleteSubcategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const AuthService = require("../Services/authService");

// merge params : to access parameters from another route
const router = express.Router({ mergeParams: true });

router.post(
  "/",
  AuthService.auth,
  AuthService.allowedTo("admin", "manager"),
  setcategoryIdToBody,
  createSubcategoryValidator,
  creatSubCategory
);
router.get("/:id", getSubcategoryValidator, getSubCategory);
router.get("/", creatFilterObj, getSubCategories);
router.put(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo("admin", "manager"),
  ubdateSubcategoryValidator,
  updateSubCategory
);
router.delete(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo("admin"),
  deleteSubcategoryValidator,
  deleteSubCategory
);
module.exports = router;
