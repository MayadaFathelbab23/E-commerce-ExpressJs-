const {check} = require('express-validator')
const validationMiddleware = require('../../middleware/validatorMiddleware')
const Product = require('../../Models/ProductModel')
const User = require('../../Models/userModel')


exports.addToWishlistValidator = [
    check('productId').notEmpty().withMessage("Product ID is required")
    .isMongoId().withMessage("Invalid ID format")
    .custom(async(val , {req})=>{
        const product = await Product.findById(val)
        if(!product){
            throw new Error("No product exist with this Id")
        }
        const user = await User.findById(req.user._id)
        if(user.wishList.includes(val)){
            throw new Error("Product alredy exist in your wish list")
        }
    }),
    validationMiddleware
]

exports.removeFromWishlistValidator = [
    check('productId').notEmpty().withMessage("Product Id is required")
    .isMongoId().withMessage("Invalid Id format")
    .custom(async(val , {req})=>{
        const product = await Product.findById(val)
        if(!product){
            throw new Error("No product exist with this Id")
        }
        const user = await User.findById(req.user._id)
        if(!user.wishList.includes(val)){
            throw new Error("Trying to delete product not exist in your wishlist")
        }
    }),
    validationMiddleware
]