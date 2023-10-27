const mongoose = require('mongoose')

const Product = require('./ProductModel')

const reviewSchema = new mongoose.Schema({
    title :{
        type : String ,
        maxLength : [150 , "Too long review description"]
    },
    rating :{
        type : Number ,
        min : [1 , "minimum rating number 1.0"],
        max : [5 , "maximum rating number is 5.0"]
    },
    user :{
        type : mongoose.Schema.ObjectId ,
        required : [true , "Review must belong to user"] ,
        ref : 'user'
    },
    product :{
        type : mongoose.Schema.ObjectId, 
        required : [true , "Review must belong to product"],
        ref : 'Product'
    }
} , {timestamps : true})
// populate user
reviewSchema.pre(/^find/ , function(next){
    this.populate({
        path : "user",
        select : 'name profileImage'
    })
    next()
})

// Aggregation
reviewSchema.statics.AvgRatingsAndRatingsCount = async function(productId){
    // Aggregation pipline
    const result = await this.aggregate([
        //stadge 1 get all reviews on product(productId)
        {$match : {product : productId}},
        // stadge 2 group by ratings avg and count fo ratings
        {$group : {_id : '$product' , ratingAvg : {$avg : '$rating'} , ratingCount : {$sum : 1}}}
    ])
    // update rating avg and count of ratings in product model
    if(result.length > 0){
        await Product.findByIdAndUpdate(productId , {
            ratingsAverage : result[0].ratingAvg ,
            ratingCount : result[0].ratingCount
        })
    }else{
        await Product.findByIdAndUpdate(productId , {
            ratingsAverage :0 ,
            ratingCount : 0
        })
    }
}
// Apply aggregation when create a review
reviewSchema.post('save' , async function(){
    await this.constructor.AvgRatingsAndRatingsCount(this.product)
})
reviewSchema.pre('deleteOne' , {document : true , query : false} ,  async function(){
    await this.constructor.AvgRatingsAndRatingsCount(this.product)
})
module.exports = mongoose.model('Reviews' , reviewSchema)