const { check} = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const Review = require('../../Models/reviewModel')
const User = require('../../Models/userModel')

exports.createReviewVlidator = [
    check('title').optional()
    .isLength({max : 150}).withMessage("Review content is too long"),
    check('rating').notEmpty().withMessage("Rating number is required")
    .isFloat({min : 1 , max : 5}).withMessage("Rating Value is between 1 to 5"),
    check('user').isMongoId().withMessage("invalid user id format")
    .notEmpty().withMessage("User id is required"),
    check('product').isMongoId().withMessage("invalid product ID format")
    .notEmpty().withMessage("Product ID is required")
    .custom(async(val , {req})=>{
        const review = await Review.findOne({user : req.user._id , product : req.body.product})
        if(review){
            throw new Error("You already create a review on this product befor")
        }
    }),
    validatorMiddleware
]

exports.updateReviewValidator = [
    check('id').isMongoId().withMessage("Invalid Review ID format")
    .custom(async(val , {req})=>{
        const review = await Review.findById(val)
        if(!review){
            throw new Error(`No Review fo this ID ${val}`)
        }
        if(review.user._id.toString() !== req.user._id.toString()){
            throw new Error("You are not allowed to update the others reviews")
        }
    }),
    check('title').optional()
    .isLength({max : 150}).withMessage("Review content is too long"),
    check('rating').optional()
    .isFloat({min : 1 , max : 5}).withMessage("Rating Value is between 1 to 5"),
    validatorMiddleware
]

exports.deleteReviewValidator = [
    check('id').isMongoId().withMessage("Invalid Review ID format")
    .custom(async(val , {req})=>{
        const review = await Review.findById(val)
        if(!review){
            throw new Error(`No Review fo this ID ${val}`)
        }
        if(req.user.role === 'user'){
            if(review.user._id.toString() !== req.user._id.toString()){
                throw new Error("You are not allowed to delete the others reviews")
            }
        }   
    }),
    validatorMiddleware
]