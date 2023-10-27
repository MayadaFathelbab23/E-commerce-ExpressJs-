const {check} = require('express-validator')
const validationMiddleware = require('../../middleware/validatorMiddleware')
const User = require('../../Models/userModel')


exports.addAddressValidator = [
    check('alias').notEmpty().withMessage("Required alias name for this address")
    .isLength({min : 2 , max : 30}).withMessage("alias name is between 2 to 30 character")
    .custom(async(val , {req})=>{
        const user = await User.findById(req.user._id)
        user.addresses.forEach((address)=>{
            if(address.alias === val){
                throw new Error("This address alias is already exist")
            }
            if(address.details === req.body.details){
                throw new Error("This address is already exist")
            }
        })
    })
    ,check('details').optional().isLength({min : 10 , max : 100}),
    check('city').notEmpty().withMessage("City name is required"),
    check('postalCode').notEmpty().withMessage("Postal code is required"),
    // .isPostalCode().withMessage("Invalid postal code"),
    check('phone').optional().isMobilePhone('ar-EG').withMessage("Invalid phone number"),
    validationMiddleware
]

exports.removeFromAddressesValidator = [
    check('addressId').notEmpty().withMessage("address Id is required")
    .isMongoId().withMessage("Invalid Id format")
    .custom(async(val , {req})=>{
        const user = await User.findById(req.user._id)
        const addressesId = []
        user.addresses.forEach((address)=>{
            addressesId.push(address._id)
        })
        if(!addressesId.includes(val)){
            throw new Error("Trying to delete address not exist in your addresses")
        }
    }),
    validationMiddleware
]