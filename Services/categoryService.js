
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandelr = require("express-async-handler");

const categoryModel = require('../Models/CategoryModel');
const factory = require('./handlerFactory');
const {uploadSingleMemoryImage} = require('../middleware/uploadImageMiddleware')


// upload single file middleware
exports.uploadCategoryImage = uploadSingleMemoryImage('image')

// image processing
exports.imagePrecessing = asyncHandelr(async (req , res , next)=>{
    // console.log(req.file);
    const fName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    if(req.file){
        await sharp(req.file.buffer)
        .resize(600,600)
        .toFormat("jpeg")
        .jpeg({quality : 90})
        .toFile(`uploads/category/${fName}`);
        req.body.image = fName;
    }
    next();
})
// @desc    create category
// @Route   POST  /api/categories
// @access  private/Admin-manager
exports.createCategory = factory.CreateOne(categoryModel);
// @desc    gar all categories
// @Route   GET /api/categories
// @access  public
exports.getCategories = factory.getAll(categoryModel);

// @desc  get specific category
// @Route GET /api/categories/:id
// @access  public
exports.getCategory = factory.getOne(categoryModel);

// @desc  update category data
// @Route PUT /api/categories/:id
// @access private/Admin-manager
exports.updateCategory = factory.UpdateOne(categoryModel)

// @desc delete category
// @desc  /api/categories/:id
// @access private/Admin

exports.deleteCategory = factory.DeleteOne(categoryModel)
