const asyncHandelr = require("express-async-handler")
const sharp = require('sharp');
const { slugify } = require("slugify");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const user = require('../Models/userModel');
const ApiError = require('../utils/apiError')
const factory = require('./handlerFactory');

const {uploadSingleMemoryImage} = require('../middleware/uploadImageMiddleware');



exports.uploadProfileImage = uploadSingleMemoryImage('profileImage')

exports.imageProfilePrecessing = asyncHandelr(async (req,res,next)=>{
    if(req.file){
        const fName = `user-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
        .resize(1000 , 700)
        .toFormat("jpeg")
        .jpeg({quality : 95})
        .toFile(`uploads/Users/${fName}`);
        req.body.profileImage = fName;
    }
    next();
})

// @desc    create user
// @Route   POST  /api/users
// @access  private/admin

exports.createUser = factory.CreateOne(user);
// @desc  get specific user
// @Route GET /api/users/:id
// @access  private / admin
exports.getUser = factory.getOne(user)
// @desc    gar all users
// @Route   GET /api/users
// @access  private / admon - manager
exports.getUsers = factory.getAll(user);
// @desc  update user data
// @Route PUT /api/users/:id
// @access private / admin
exports.updateUser = asyncHandelr(async (req , res , next)=>{
    const Document = await user.findByIdAndUpdate(
      req.params.id,
      {
        name : req.body.name,
        slug : slugify(req.body.name),
        email : req.body.email,
        role : req.body.role,
        phone : req.body.phone,
        profileImage : req.body.profileImage
      },
      { new: true }
    );
    if (!Document) {
      return next(new ApiError(`Document for this id ${req.params.id} not found`, 404));
    }
    res.status(200).json({ data: Document });
})

// @desc update user password
// @Route PUT /api/users/:id
// @access private / admin
// eslint-disable-next-line prefer-arrow-callback
exports.updatePassword = asyncHandelr(async (req , res , next)=>{
    const doc = await user.findByIdAndUpdate(
        req.params.id,
        {
            password : await bcrypt.hash(req.body.password, 10),
            passwordChangedAt : Date.now()
        },
        {new : true}
    )
    if(!doc){
         next(new ApiError("User not found" , 404))
    }
    res.status(200).json({data : doc})
    
})
// @desc delete user
// @desc  /api/users/:id
// @access private / admin
exports.deleteUser = factory.DeleteOne(user)
//                                  Logged User Services
// @desc  get logged in user data
// @Route GET /api/users/getMe
// @access  private / user
exports.getMyData = asyncHandelr(async(req , res , next)=>{
  req.params.id = req.user._id
  next();
})

// @desc  update logged in user password
// @Route PUT /api/users/updateMyPassword
// @access  private / user

exports.updateMyPassword = asyncHandelr(async(req , res , next)=>{
  const updatedUser = await user.findByIdAndUpdate(req.user._id , {
    password : await bcrypt.hash(req.body.password , 12),
    passwordChangedAt : Date.now()
  }, 
  {new : true})
  // generate token
  const token = jwt.sign({id :updatedUser._id} , process.env.JWT_SECRETE_KEY , {
    expiresIn : process.env.JWT_EXPIRE_DATE})
    res.status(200).json({data : updatedUser , token})
})

// @desc  update logged in user data
// @Route PUT /api/users/updateMe
// @access  private / user

exports.updateMe = asyncHandelr(async (req , res , next)=>{
  const updatedUser = await user.findByIdAndUpdate(req.user._id , {
    name : req.body.name ,
    email : req.body.email ,
    phone : req.body.phone,
    profileImage : req.body.profileImage
  } , {new : true})
  res.status(200).json({data : updatedUser})
})

// @desc  Delete logged in user data
// @Route DELETE /api/users/updateMe
// @access  private / user

exports.deleteMe = asyncHandelr(async(req , res , next)=>{
  await user.findByIdAndUpdate(req.user._id , {active : false} , {new : true})
  res.status(204).json({status : "success"})
})
