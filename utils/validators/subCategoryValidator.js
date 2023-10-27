const {check , body } = require('express-validator') ;
const slugify = require('slugify');
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getSubcategoryValidator = [
    check('id').notEmpty().withMessage("sub Category ID is required")
    .isMongoId().withMessage("invalid sub category ID format"),
    validatorMiddleware
]

exports.createSubcategoryValidator = [
    check('name')
    .notEmpty().withMessage("subCategory name in required")
    .isLength({min : 2}).withMessage("Minimum length of name is 2 characters")
    .isLength({max : 35}).withMessage("maximum length for name is 35 character")
    ,body('name').custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    })
    ,check('category')
    .isMongoId().withMessage("invalid category id")
    .notEmpty().withMessage("Category is required for subCategory")
    , validatorMiddleware   
]

exports.ubdateSubcategoryValidator = [
    check('id')
    .isMongoId().withMessage("invalid sub category id")
    .notEmpty().withMessage("sub Category id required"),
    body('name').custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware 
]

exports.deleteSubcategoryValidator = [
    check('id')
    .isMongoId().withMessage("invalid sub category id")
    .notEmpty().withMessage("sub Category id required"),
    validatorMiddleware
]