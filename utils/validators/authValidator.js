const {check , body} = require('express-validator');
const slugify  = require('slugify');
const bcrypt = require('bcryptjs')
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const user = require('../../Models/userModel');


exports.signupValidator = [
    body('name').notEmpty().withMessage('Username is required')
    .isLength({min : 3}).withMessage("Username at least 3 characters")
    .custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage("Email is required")
    .isEmail().withMessage("invalid email format")
    .custom(async (val)=>{
        const data = await user.findOne({email : val});
        if(data){
            throw new Error("Email already exist");
        }
    }),
    check('password').notEmpty().withMessage("Password is required")
    .isLength({min : 6}).withMessage("Password at least 6 characters")
    .custom((val , {req})=>{
        if(val !== req.body.passwordConirm){
            return new Error("password does not match with password confirmation")
        }
        return true
    }),
    check('passwordConirm').notEmpty().withMessage("Please fill passowrd confirmation"),
    check('profileImage').optional(),
    check('phone').isMobilePhone('ar-EG').withMessage("Invalid phone number")
    .notEmpty().withMessage("phone number is required"),
    validatorMiddleware
]

exports.loginValidator = [
    
    check('email').notEmpty().withMessage("Email is required")
    .isEmail().withMessage("invalid email format")
    ,
    check('password').notEmpty().withMessage("Password is required")
    .isLength({min : 6}).withMessage("Password at least 6 characters")
    ,
    validatorMiddleware
]