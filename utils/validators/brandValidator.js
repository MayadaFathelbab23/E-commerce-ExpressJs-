const { check , body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.createBrandValidator = [
    check('name')
    .notEmpty().withMessage("category name in required")
    .isLength({min : 4}).withMessage("Minimum length of name is 4 characters")
    .isLength({max : 35}).withMessage("maximum length for name is 35 character")
    ,body('name').custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware
]

exports.getBrandValidator = [
    check('id').isMongoId().withMessage("Category Id not valid")
    .notEmpty().withMessage("Brand id is required"),
    validatorMiddleware
]

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage("Category Id not valid")
    .notEmpty().withMessage("Brand id is required"),
    body('name').custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware
]

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage("Category Id not valid")
    .notEmpty().withMessage("Brand id is required"),
    validatorMiddleware
]
