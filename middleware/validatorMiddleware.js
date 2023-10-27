const { validationResult } = require('express-validator');
// const ApiError = require('../utils/apiError');

const validatorMiddleware = (req , res , next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error : error.array()})
    }
    next(); // next == service
}

module.exports = validatorMiddleware;