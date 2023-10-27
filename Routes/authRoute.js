const express = require('express')
const {signup , login } = require('../Services/authService')
const {signupValidator , loginValidator} = require('../utils/validators/authValidator')
const {forgetPassword , verifyResetCode , resetPassword} = require('../Services/forgetPassword')

const router = express.Router();


router.post('/signup' , signupValidator , signup)
router.post('/login' , loginValidator , login)
router.post('/forgetPassword' , forgetPassword)
router.post('/verifyResetCode' , verifyResetCode)
router.put('/resetPassword' , resetPassword)
module.exports = router;