
const subCategoryModel = require("../Models/subCategoryModel");
const factory = require('./handlerFactory')
// categoryId middleware
exports.setcategoryIdToBody = (req , res , next)=>{
    if(req.params.categoryId){
        req.body.category = req.params.categoryId
    }
    next()
}
// @desc create sub category
// route POST /api/subCategory
// @access private/Admin-manager
exports.creatSubCategory = factory.CreateOne(subCategoryModel);
// @desc    get category
// @route   GET /api/subCategory/:id
// @access  public
exports.getSubCategory = factory.getOne(subCategoryModel);

// GET /api/categories/:categoryId/subCategories (Nested Route)
exports.creatFilterObj = (req , res , next)=>{
    let filterObj = {};
  if(req.params.categoryId){
    filterObj = {category : req.params.categoryId}
  }
  req.filterObj = filterObj;
  next();
}
// @desc    get all sub categories
// @route   GET /api/subCategory
// @access  public

exports.getSubCategories = factory.getAll(subCategoryModel);
// @desc    update subCategory
// @route   PUT /api/subCategory/:id
// @access  private/Admin-manager
exports.updateSubCategory = factory.UpdateOne(subCategoryModel)
// @desc    delete subCategory
// @route   DELETE /api/subCategory/:id
// @access  private/Admin
exports.deleteSubCategory = factory.DeleteOne(subCategoryModel);
