const {check , body} = require('express-validator');
const slugify  = require('slugify');
const bcrypt = require('bcryptjs')
const validatorMiddleware = require('../../middleware/validatorMiddleware');
const user = require('../../Models/userModel');



exports.createUserValidator = [
    check('name').notEmpty().withMessage('Username is required')
    .isLength({min : 3}).withMessage("Username at least 3 characters")
    .custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is invalid")
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
    check('passwordConirm').notEmpty().withMessage("Please fill passowrd confirmatio"),
    check('role').optional(),
    check('profileImage').optional(),
    check('phone').isMobilePhone('ar-EG').withMessage("Invalid phone number")
    .notEmpty().withMessage("phone number is required"),
    validatorMiddleware
]

exports.UserIdValidator = [
    check('id').isMongoId().withMessage("user Id not valid")
    .notEmpty().withMessage("user id is required"),
    validatorMiddleware
]

exports.changePasswordValidator = [
    body('currentPassword').custom(async (val , {req})=>{
        // verify user password = current password
        const doc = await user.findById(req.params.id)
        if(!doc){
            throw new Error(`User Not found for this id ${req.params.id}`)
        }
        const acceptedPassword = await bcrypt.compare(val , doc.password)
        if(!acceptedPassword){
            throw new Error('wrong current password');
        }
        return true
    })
    .notEmpty().withMessage("Current password is reqired"),
    // verify confirm = password
    body('passwordConfirm').notEmpty().withMessage('please confirm password')
    .custom((val , {req})=>{
        if(val !== req.body.password){
            throw new Error("password confirmation does not match with new password")
        }
        return true
    }),
    body('password').notEmpty().withMessage('please enter your new password'),
    validatorMiddleware
]

exports.updateUserValidator = [
    check('name').optional()
    .isLength({min : 3}).withMessage("Username at least 3 characters")
    .custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').optional()
    .isEmail().withMessage("Email is invalid")
    .custom(async (val)=>{
        const data = await user.findOne({email : val});
        if(data){
            throw new Error("Email already exist");
        }
    }),
    check('role').optional(),
    check('profileImage').optional(),
    check('phone').isMobilePhone('ar-EG').withMessage("Invalid phone number")
    .optional(),
    validatorMiddleware
]


exports.updateLoggedUserValidator = [
    check('name').optional()
    .isLength({min : 3}).withMessage("Username at least 3 characters")
    .custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').optional()
    .isEmail().withMessage("Email is invalid")
    .custom(async (val)=>{
        const data = await user.findOne({email : val});
        if(data){
            throw new Error("Email already exist");
        }
    }),
    check('profileImage').optional(),
    check('phone').isMobilePhone('ar-EG').withMessage("Invalid phone number")
    .optional(),
    validatorMiddleware
]