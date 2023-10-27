class ApiError extends Error{
    constructor(message , statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4)? "fail" : "Error"; // code > 400 (fail)
        this.isOperational = true ; // operational error = error that i can predict
    }
};

module.exports = ApiError;