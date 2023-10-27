const asyncHandelr = require("express-async-handler")

const User = require('../Models/userModel');
const ApiError = require('../utils/apiError')


// @desc    Add product to user wishlist
// @Route   POST  /api/wishlist
// @access  Protected/user

exports.addToWishlist = asyncHandelr(async(req , res , next)=>{
    // $addToSet : add new element without repeating (if not exist)
    const user = await User.findByIdAndUpdate(req.user._id , {
        $addToSet : {wishList : req.body.productId}
    } , {new : true})

    if(!user){
        return next(new ApiError("cannot find this user" , 404))
    }
    res.status(200).json({
        status : 'Success' ,
        message : "Product added to your wishlist successfully",
        data : user.wishList
    })
});

// @desc    Remove product from user wishlist
// @Route   DELETE  /api/wishlist/:productId
// @access  Protected/user

exports.removeFromWishlist = asyncHandelr(async(req , res , next)=>{
    // $pull : remove element (if exist)
    const user = await User.findByIdAndUpdate(req.user._id , {
        $pull : {wishList : req.params.productId}
    } , {new : true})

    if(!user){
        return next(new ApiError("cannot find this user" , 404))
    }
    res.status(200).json({
        status : 'Success' ,
        message : "Product removed from o your wishlist successfully",
        data : user.wishList
    })
});

// @desc    Get user wishlist
// @Route   GET  /api/wishlist
// @access  Protected/user

exports.getMyWishlist = asyncHandelr(async (req , res , next)=>{
    const user = await User.findById(req.user._id).populate('wishList');

    res.status(200).json({
        status : "success" , 
        results : user.wishList.length ,
        data : user.wishList
    })

})