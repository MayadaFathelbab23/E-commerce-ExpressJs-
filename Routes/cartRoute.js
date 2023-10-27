const express = require("express");

const {
  addProductToCart,
  getUserCart,
  deleteCartItem,
  clearUserCart,
  updateCartItemQuantity,
  applyCoupon ,
} = require("../Services/cartService");
const AuthService = require("../Services/authService");

const router = express.Router();
router.use(AuthService.auth, AuthService.allowedTo("user"));

router.post("/", addProductToCart);
router.get("/", getUserCart);
router.delete("/:itemId", deleteCartItem);

router.put("/applyCoupon" , applyCoupon)
router.put('/:itemId', updateCartItemQuantity);

router.delete("/", clearUserCart);

module.exports = router;
