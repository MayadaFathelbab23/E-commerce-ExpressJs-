const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({
    items : [{
        product : {
            type : mongoose.Schema.ObjectId,
            ref : 'Product'
        },
        quantity : {
            type : Number ,
            default : 1
        } ,
        price : Number ,
        color : String
    }],
    totalPrice : {
        type : Number ,
        default : 0
    } ,
    discouteTotalPrice : Number,
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'user'
    }
} , {timestamps : true})


module.exports = mongoose.model('Cart' , cartSchema)