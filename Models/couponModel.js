const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    name : {
        type : String ,
        trim : true ,
        required : [true , "Coupon name is required"],
        unique : [true , "Coupon name is already exist"]
    },
    expire : {
        type : Date ,
        required : [true , "Coupon expire date is required"]
    },
    discount : {
        type : Number ,
        required : [true , "Coupon discount is required"],
        min : [0 , "Minimum discount value is zero"],
        max : [1 , "Maximum discount value is 100 %"]
    }
} , {timestamps : true})

module.exports = mongoose.model('Coupon' , couponSchema)

