const express = require('express')

const {addAddress , removeAddress , getMyAddress} = require('../Services/addressService')
const {addAddressValidator , removeFromAddressesValidator} = require('../utils/validators/addressesValidator')
const AuthService = require('../Services/authService')

const router = express.Router();
router.use(AuthService.auth , AuthService.allowedTo('user'))

router.post('/' , addAddressValidator ,addAddress)

router.get('/' ,getMyAddress)

router.delete('/:addressId' , removeFromAddressesValidator ,removeAddress )
module.exports = router