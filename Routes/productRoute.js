const express = require("express");

const {
  getProducts,
  getProduct,
  creatProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  imageProcessing,
} = require("../Services/productService");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const AuthService = require("../Services/authService");
const reviewRoute = require('./reviewRoute')

const router = express.Router();
// Nested Route
// GET  api/products/:productId/reviews           (get all reviews for this product)
// GET  api/products/:productId/reviews/reviewId  (get review for this product)
// POST api/products/:productId/reviews           (create review for this product)
router.use('/:productId/reviews' , reviewRoute)


router.get("/", getProducts);
router.get("/:id", getProductValidator, getProduct);
router.post(
  "/",
  AuthService.auth,
  AuthService.allowedTo("admin", "manager"),
  uploadProductImages,
  imageProcessing,
  createProductValidator,
  creatProduct
);
router.put(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo("admin", "manager"),
  uploadProductImages,
  imageProcessing,
  updateProductValidator,
  updateProduct
);
router.delete(
  "/:id",
  AuthService.auth,
  AuthService.allowedTo("admin"),
  deleteProductValidator,
  deleteProduct
);

module.exports = router;
