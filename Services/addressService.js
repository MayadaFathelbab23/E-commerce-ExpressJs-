const asyncHandelr = require("express-async-handler")

const User = require('../Models/userModel');
const ApiError = require('../utils/apiError')


// @desc    Add address to user addresses
// @Route   POST  /api/addresses
// @access  Protected/user

exports.addAddress = asyncHandelr(async(req , res , next)=>{
    // $addToSet : add new element without repeating (if not exist)
    const user = await User.findByIdAndUpdate(req.user._id , {
        $addToSet : {addresses : req.body}
    } , {new : true})

    if(!user){
        return next(new ApiError("cannot find this user" , 404))
    }
    res.status(200).json({
        status : 'Success' ,
        message : "Address added successfully",
        data : user.addresses
    })
});

// @desc    Remove address from user
// @Route   DELETE  /api/addresses/:addressId
// @access  Protected/user

exports.removeAddress = asyncHandelr(async(req , res , next)=>{
    // $pull : remove element (if exist)
    const user = await User.findByIdAndUpdate(req.user._id , {
        $pull : {addresses : {_id : req.params.addressId}}
    } , {new : true})

    if(!user){
        return next(new ApiError("cannot find this user" , 404))
    }
    res.status(200).json({
        status : 'Success' ,
        message : "Address removed successfully",
        data : user.addresses
    })
});

// @desc    get all user addresses
// @Route   GET  /api/addresses/
// @access  Protected/user

exports.getMyAddress = asyncHandelr(async (req , res , next)=>{
    const user = await User.findById(req.user._id).populate('addresses');

    res.status(200).json({
        status : "success" , 
        results : user.addresses.length ,
        data : user.addresses
    })

})