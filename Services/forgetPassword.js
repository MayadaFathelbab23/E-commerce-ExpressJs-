const crypto = require('crypto')
const asyncHandelr = require('express-async-handler');

const jwt = require('jsonwebtoken')
const User = require('../Models/userModel');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/Email');

// @desc    forget reset password
// @Route   POST /api/auth/forgetPassword
// @access  private / user
exports.forgetPassword = asyncHandelr(async (req , res , next)=>{
    // 1- verify email
    const user = await User.findOne({email : req.body.email})
    if(!user){
        return next(new ApiError("please enter your correct email" , 404))
    }
    // 2- generate reset code from 6 random digits
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex')
    // save hashed code in user data
    user.passwordResetCode = hashedResetCode;
    user.passwordResetExpire = Date.now() + 10 * 60 * 1000 // code expire after 10 min
    user.passwordResetVerified = false;
    await user.save()
    // 3- send reset code via email
    const msg = `Hi ${user.name},\n Here is your Reset code ${resetCode} , please enter it to crrate your new password \n Thank tou`
    try{
        await sendEmail({
            email : user.email ,
            subject : "E-commerce Password Reaset Code",
            message : msg
        })
    }catch(err){
        user.passwordResetCode = undefined ;
        user.passwordResetExpire = undefined ;
        user.passwordResetVerified = undefined
        await user.save();
        return next(new ApiError("Sending email failed !!" , 500))
    }
    res.status(200).json({statue : "Success" , mesaage : "Email sent to user successfully"})
    
})

// @desc    verify reset password code
// @Route   POST /api/auth/verifyResetCode
// @access  private / user
exports.verifyResetCode = asyncHandelr(async (req , res , next)=>{
    // 1- get user based on reset code
    const hashedResetCode = crypto.createHash('sha256').update(req.body.passwordResetCode).digest('hex')
    const user = await User.findOne({
        passwordResetCode : hashedResetCode ,
        passwordResetExpire : {$gt : Date.now()}
    })
    if(!user){
        return next(new ApiError("Invalid or expired reset code"))
    }
    user.passwordResetVerified = true;
    await user.save();
    res.status(200).json({status : "Success"})
})

// @desc    reset password
// @Route   POST /api/auth/resetPassword
// @access  private / user
exports.resetPassword = asyncHandelr(async(req , res , next)=>{
    // get user by email
    const user = await User.findOne({email : req.body.email})
    if(!user){
        return next(new ApiError("invalid email" , 404))
    }
    // check code if verified
    if(!user.passwordResetVerified){
        return next(new ApiError("please verify your rest code" , 400))
    }
    // save new pasword
    user.password = req.body.password
    user.passwordResetCode = undefined
    user.passwordResetExpire = undefined
    user.passwordResetVerified = undefined
    await user.save();
    // generat token
    const token = jwt.sign({id : user._id} , process.env.JWT_SECRETE_KEY , {expiresIn : process.env.JWT_EXPIRE_DATE})
    res.status(200).json({token})
})