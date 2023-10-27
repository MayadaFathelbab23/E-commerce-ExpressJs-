const ApiError = require("../utils/apiError");

const DevError = (err , res)=>res.status(err.statusCode).json({
    status : err.status ,
    error : err,
    message : err.message ,
    stack : err.stack
    });
const ProdError = (err , res)=>res.status(err.statusCode).json({
        status : err.status ,
        message : err.message 
    });

// eslint-disable-next-line arrow-body-style
const invalidJwtSignature = ()=>{
    // eslint-disable-next-line no-new
    return new ApiError("Invalid token , please login again" , 401)
}

// eslint-disable-next-line arrow-body-style
const invalidJwtExpired = ()=>{
    // eslint-disable-next-line no-new
    return new ApiError("expired token , please login again" , 401)
}
    

const ErrorHandel = (err , req , res , next)=>{
    err.statusCode = err.statusCode || 500 ;
    err.status = err.status || "error";
    if(process.env.NODE_ENV === "development"){
        
        DevError(err , res);
    }else{
        if(err.name === 'JsonWebTokenError'){
            err = invalidJwtSignature()
        }
        if(err.name === 'TokenExpiredError'){
            err = invalidJwtExpired();
        }
        ProdError(err , res);
    }   
};

module.exports = ErrorHandel;