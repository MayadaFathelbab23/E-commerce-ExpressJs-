const { check , body } = require("express-validator");
const slugify = require('slugify')
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage("Category Id not valid"),
    validatorMiddleware
]

exports.createCategoryValidator = [
    check('name')
    .notEmpty().withMessage("category name in required")
    .isLength({min : 4}).withMessage("Minimum length of name is 4 characters")
    .isLength({max : 35}).withMessage("maximum length for name is 35 character")
    ,body('name').custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    })
    , validatorMiddleware
]

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage("Category Id not valid"),
    body('name').custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware
]
exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage("Category Id not valid"),
    validatorMiddleware
]