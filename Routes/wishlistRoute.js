const express = require('express')

const {addToWishlist , removeFromWishlist , getMyWishlist} = require('../Services/wishlistServices')
const {addToWishlistValidator , removeFromWishlistValidator} = require('../utils/validators/wishlistValidator')
const AuthService = require('../Services/authService')

const router = express.Router();
router.use(AuthService.auth)

router.post('/' , AuthService.allowedTo('user'), addToWishlistValidator ,addToWishlist)

router.get('/' , AuthService.allowedTo('user'),getMyWishlist)

router.delete('/:productId' , AuthService.allowedTo('user') , removeFromWishlistValidator ,removeFromWishlist )
module.exports = router