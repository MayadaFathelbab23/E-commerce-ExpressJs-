// const asyncHandelr = require('express-async-handler')

const factory = require('./handlerFactory')
const Review = require('../Models/reviewModel');

// Nest Route (create review)
exports.setProductandUser = (req , res , next)=>{
    if(req.params.productId || !req.body.product){
        req.body.product = req.params.productId
    }
    if(!req.body.user){
        req.body.user = req.user._id
    }
    next()
}
// Nested Route (GET review/s)
exports.creatFilterObj = (req , res , next)=>{
  let filterObj = {};
if(req.params.productId){
  filterObj = {product : req.params.productId}
}
req.filterObj = filterObj;
next();
}
// @desc    create Review
// @Route   POST  /api/reviews
// @access  private/auth/user
exports.createReview = factory.CreateOne(Review);

// @desc  get specific review
// @Route GET /api/brands/:id
// @access  public
exports.getReview = factory.getOne(Review)
// @desc    gar all reviews
// @Route   GET /api/reviews
// @access  public
exports.getReviews = factory.getAll(Review);
// @desc  update Review
// @Route PUT /api/reviews/:id
// @access private/auth/user
exports.updateReview = factory.UpdateOne(Review)
// @desc delete Review
// @desc  /api/reviews/:id
// @access private/Admin -mmanager - user
exports.deleteReview = factory.DeleteOne(Review)