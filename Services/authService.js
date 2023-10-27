const asyncHandelr = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const user = require('../Models/userModel');
const ApiError = require('../utils/apiError');


// @desc    signup
// @Route   /api/auth/signup
// @Access  puplic
exports.signup = asyncHandelr(async (req , res , next)=>{
    // 1- create user
    const newUser = await user.create({
        name : req.body.name ,
        email : req.body.email ,
        password : req.body.password,
        profileImage : req.body.profileImage
    });
    // 2- craete tohen
    const token = jwt.sign({id :newUser._id} , process.env.JWT_SECRETE_KEY , {
        expiresIn : process.env.JWT_EXPIRE_DATE})

    res.status(201).json({data : newUser , token : token})
})
// @desc    login
// @Route   /api/auth/login
// @access  public
exports.login = asyncHandelr(async (req , res , next)=>{
    // find user by email
    const doc = await user.findOne({email : req.body.email});
    // check email and pasword
    if(!doc || !(await bcrypt.compare(req.body.password , doc.password))){
        return next(new ApiError("invalid email or password" , 401))
    }
    // scheck if user acount in deactivate 
    if(doc.active === false){
        doc.active = true;
        await doc.save()
    }
    // generate token
    const token = jwt.sign({id :doc._id} , process.env.JWT_SECRETE_KEY , {
        expiresIn : process.env.JWT_EXPIRE_DATE})
    // response
    res.status(200).json({data : doc , token : token})

})
// @desc    verify user authentication
// @Route   /api/auth/login
// @access  public
exports.auth = asyncHandelr(async (req , res , next)=>{
    // 1- check if token exist (user is login)
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }
    if(!token){
        return next(new ApiError("you are not login" , 401))
    }
    // 2- verify token (no change , expired)
    const decoded = jwt.verify(token , process.env.JWT_SECRETE_KEY);
    // 3- check if user exists in database
    const currentUser = await user.findById(decoded.id);
    if(!currentUser){
        return next(new ApiError("User for this token not exist" , 401))
    }
    // 4- check if password is changed after token is created
    if(currentUser.passwordChangedAt){
        const passowrdTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000 , 10);
        if(passowrdTimestamp > decoded.iat){
            return next(new ApiError("You recently changed your password , please login again" , 401))
        }
    }
    // 5- check user is active
    if(!currentUser.active){
        return next(new ApiError("Your account is not acive" , 401))
    }
    req.user = currentUser;
    next();
    
})
// authorization roles
exports.allowedTo = (...roles)=>
    asyncHandelr(async (req , res , next)=>{
        // check user role in inclided in roles
        if(!roles.includes(req.user.role)){
            return next(new ApiError("You are not authorized to eccess this resource" ,403 ))
        }
        next();
})
