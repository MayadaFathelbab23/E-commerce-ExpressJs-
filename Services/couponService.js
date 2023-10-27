
const factory = require('./handlerFactory')
const Coupon = require('../Models/couponModel')


// @desc    create Coupon
// @Route   POST  /api/coupons
// @access  private/auth/Admin- manager
exports.createCoupon = factory.CreateOne(Coupon);

// @desc  get specific Coupon
// @Route GET /api/coupons/:id
// @access  private/auth/Admin- manager
exports.getCoupon = factory.getOne(Coupon)
// @desc    gar all coupons
// @Route   GET /api/coupons
// @access  private/auth/Admin- manager
exports.getCoupons = factory.getAll(Coupon);
// @desc  update Review
// @Route PUT /api/coupons/:id
// @access private/auth/Admin- manager
exports.updateCoupon = factory.UpdateOne(Coupon)
// @desc delete Coupon
// @desc  /api/coupons/:id
// @access private/auth/Admin- manager
exports.deleteCoupon = factory.DeleteOne(Coupon)