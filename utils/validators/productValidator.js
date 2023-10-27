const {check , body} = require('express-validator');
const slugify = require('slugify')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const Category = require('../../Models/CategoryModel')
const Subcategory = require('../../Models/subCategoryModel')
const Brand = require('../../Models/BrandModel')

exports.getProductValidator = [
    check('id').isMongoId().withMessage("Invalid product id") , 
    validatorMiddleware
]


exports.createProductValidator = [
    check('title').notEmpty().withMessage("Product title is required")
    .isLength({min : 3}).withMessage("product title at least 3 characters")
    .isLength({max : 100}).withMessage("product title is max 100 characters"),
    body('title').custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),

    check('description').notEmpty().withMessage("Product description is required")
    .isLength({min : 20}).withMessage("product description at least 20 characters")
    .isLength({max : 1000}).withMessage("product description is max 1000 characters"),

    check('quantity').notEmpty().withMessage("product quantity is required")
    .isNumeric().withMessage("product quantity must be number"),

    check('sold').optional().isNumeric().withMessage("sold products value must be a number"),

    check('price').notEmpty().withMessage("price is requred")
    .isNumeric().withMessage("Product price must be a number")
    .isLength({max : 32}).withMessage("Too long price"),

    check('priceAfterDiscount').optional()
    .isNumeric().withMessage("price after discount must be a number")
    .toFloat()
    .custom((value , {req})=>{
        if(req.body.price <= value){
            throw new Error("Price after discount must be smaller than original price")
        }
        return true
    }),

    check('colors').optional().isArray().withMessage("colors must be in array"),
    check('imageCover').notEmpty().withMessage("Product image cover is required"),
    check('images').optional().isArray().withMessage("images must be in array"),
    check('category').notEmpty().withMessage("Product must belong to category")
    .isMongoId().withMessage("Invalid category Id formate")
    // Test if category id exists in categories collection
    .custom(async (value)=>{
        const category = await Category.findById(value) ;
        if(!category){
            throw new Error(`No Category for this id ${value}`)
        }
    }) ,

    check('subcategory').optional().isMongoId().withMessage("invalid subcategory id formate")
     // Test if subcategory id exists in subcategories collection
    .custom(async (value)=>{
        const subcategories = await Subcategory.find({_id : {$exists : true , $in : value}})
        if(subcategories.length < 1 || subcategories.length !== value.length){
            throw new Error("Sub category id not exist");
        }
    })
    // Test if subcategory id belongs to category 
    .custom(async (value , {req})=>{
        const subcategories = await Subcategory.find({category : req.body.category})
        const subIds = [];
        subcategories.forEach((sub)=>{
            subIds.push(sub._id.toString());
        })
        if(! value.every((v) => subIds.includes(v)) ){
            throw new Error("Subcategory not belong to this category")
        }
    }),
    check('brand').optional().isMongoId().withMessage("invalid brand id formate")
    .custom(async (value)=>{
        const brand = Brand.findById(value);
        if(!brand){
            throw new Error(`No Brand for this id ${value}`)
        }
    }),

    check('ratingsAverage').optional().isNumeric().withMessage("Rating average must be a number")
    .isLength({min : 1}).withMessage("Rating Average must be above or equal 1")
    .isLength({max : 5}).withMessage("Rating Average must be below or equal 5"),

    check('ratingCount').optional().isNumeric().withMessage("Ratings Count must be a number"),

    validatorMiddleware
]




exports.updateProductValidator = [
    check('id').isMongoId().withMessage("Invalid product id") , 
    // check('priceAfterDiscount')
    // .custom((value , {req})=>{
    //     if(req.body.price <= value){
    //         throw new Error("Price after discount must be smaller than original price")
    //     }
    //     return true
    // }),
    // check('price')
    // .custom((value , {req})=>{
    //     if(req.body.priceAfterDiscount > value){
    //         throw new Error("Price after discount must be smaller than original price")
    //     }
    //     return true
    // }),
    body('title').custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware
]

exports.deleteProductValidator = [
    check('id').isMongoId().withMessage("Invalid product id") , 
    validatorMiddleware
]