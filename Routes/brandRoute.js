const express = require("express");
const {
  createBrand,
  getBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  imagePrecessing,
} = require("../Services/brandService");
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");
const AuthService = require("../Services/authService");

const router = express.Router();

router.get("/", getBrands);
router.get("/:id", getBrandValidator, getBrand);
router.post(
  "/",
  AuthService.auth,
  AuthService.allowedTo("admin", "manager"),
  uploadBrandImage,
  imagePrecessing,
  createBrandValidator,
  createBrand
);
router.put(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo("admin", "manager"),
  uploadBrandImage,
  imagePrecessing,
  updateBrandValidator,
  updateBrand
);
router.delete(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo("admin"),
  deleteBrandValidator,
  deleteBrand
);

module.exports = router;
