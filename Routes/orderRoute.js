const express = require("express");

const {
  createCashOrder,
  getAllOrders,
  getOneOrder,
  userOrderFilter,
  updateOrderPaid,
  updateOrderDeliver,
  checkoutSession
} = require("../Services/orderService");
const AuthService = require("../Services/authService");

const router = express.Router();
router.use(AuthService.auth);

// Stripe create session
router.get('/checkout-session/:cartId' , AuthService.allowedTo('user') , checkoutSession)

router.post("/:cartId", AuthService.allowedTo("user"), createCashOrder);
router.get(
  "/",
  AuthService.allowedTo("user", "admin", "maneger"),
  userOrderFilter,
  getAllOrders
);
router.get(
  "/:id",
  AuthService.allowedTo("user", "admin", "maneger"),
  getOneOrder
);

router.put("/:id/paid" , AuthService.allowedTo('admin' , 'maneger') , updateOrderPaid);
router.put('/:id/deliver' ,  AuthService.allowedTo('admin' , 'maneger') , updateOrderDeliver)
module.exports = router;
