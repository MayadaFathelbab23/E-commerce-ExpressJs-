const asyncHandelr = require('express-async-handler')

const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const factory = require('./handlerFactory')
const {uploadSingleMemoryImage} = require('../middleware/uploadImageMiddleware')
const brandModel = require('../Models/BrandModel');
// upload single file middleware
exports.uploadBrandImage = uploadSingleMemoryImage('image')

// image processing

exports.imagePrecessing = asyncHandelr(async (req , res , next)=>{
    // console.log(req.file);
    const fName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    if(req.file){
        await sharp(req.file.buffer)
        .resize(1000 , 700)
        .toFormat("jpeg")
        .jpeg({quality : 90})
        .toFile(`uploads/Brand/${fName}`);
        req.body.image = fName;
    }
    next();
});
// @desc    create brand
// @Route   POST  /api/brands
// @access  private/Admin-manager
exports.createBrand = factory.CreateOne(brandModel);

// @desc  get specific brand
// @Route GET /api/brands/:id
// @access  public
exports.getBrand = factory.getOne(brandModel)
// @desc    gar all Brands
// @Route   GET /api/brands
// @access  public
exports.getBrands = factory.getAll(brandModel);
// @desc  update brand data
// @Route PUT /api/brands/:id
// @access private/Admin-manager
exports.updateBrand = factory.UpdateOne(brandModel)
// @desc delete brand
// @desc  /api/brands/:id
// @access private/Admin
exports.deleteBrand = factory.DeleteOne(brandModel)