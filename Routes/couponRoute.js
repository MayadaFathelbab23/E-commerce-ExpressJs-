const express = require("express");

const {
  createCoupon,
  updateCoupon,
  getCoupon,
  getCoupons,
  deleteCoupon,
} = require("../Services/couponService");
const AuthService = require('../Services/authService')

const router = express.Router();

router.use(AuthService.auth , AuthService.allowedTo('admin' , 'manager'))
router.post("/" , createCoupon) 
router.get('/' , getCoupons)
router.get('/:id' , getCoupon)
router.put('/:id' , updateCoupon)
router.delete('/:id' , deleteCoupon)


module.exports = router