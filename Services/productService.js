const multer = require('multer')
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandelr = require("express-async-handler");
const ApiError = require('../utils/apiError')
const{ uploadMixMemortImages} = require('../middleware/uploadImageMiddleware')
const factory = require('./handlerFactory');
const ProductModel = require('../Models/ProductModel');

// // 2- Memory storage configration
// const myStorage = multer.memoryStorage();
// // file filteration
// const filter = (req, file, cb) => {
//   // mimtype => image/jpeg
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("Only images are allowed to upload", 400), false);
//   }
// };
// const upload = multer({ storage: myStorage, fileFilter: filter });

exports.uploadProductImages = uploadMixMemortImages("imageCover" , "images")
exports.imageProcessing = asyncHandelr(async (req , res , next)=>{
    if(req.files.imageCover){
        const imageCoverName = `product-cover-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
        .resize(2000,1333)
        .toFormat("jpeg")
        .jpeg({quality : 95})
        .toFile(`uploads/product/${imageCoverName}`);
        // save to database
        req.body.imageCover = imageCoverName;
    }
    if(req.files.images){
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img , index)=>{
                const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
                await sharp(img.buffer)
                .resize(2000,1333)
                .toFormat("jpeg")
                .jpeg({quality : 95})
                .toFile(`uploads/product/${imageName}`);
                // save to database
                req.body.images.push(imageName);
            })
         )
        next();
    }
    
})
// @desc    gar all products
// @Route   GET /api/products
// @access  public
exports.getProducts = factory.getAll(ProductModel , 'Product');

// @desc  get specific product
// @Route GET /api/products/:id
// @access  public
exports.getProduct = factory.getOne(ProductModel , 'reviews');

// @desc    create product
// @Route   POST  /api/products
// @access  private/Admin-manager
exports.creatProduct = factory.CreateOne(ProductModel);
 
// @desc  update product data
// @Route PUT /api/products/:id
// @access private/Admin-manager
exports.updateProduct = factory.UpdateOne(ProductModel)
// @desc  delete product data
// @Route DELETE /api/products/:id
// @access private/Admin
exports.deleteProduct = factory.DeleteOne(ProductModel)