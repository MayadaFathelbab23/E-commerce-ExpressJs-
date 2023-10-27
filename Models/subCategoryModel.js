const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name :{
        type : String ,
        trim : true ,
        unique : [true , "subCategory must be unique"] ,
        required : [true , "subCategory name is required"],
        minLength : [2 , "subCategory name at least 4 characters"],
        maxLength : [35 , "subCategory name maximum 35 characters"]
    },
    slug :{
        type : String ,
        lowercase : true
    },
    category : {
        type : mongoose.Schema.ObjectId ,
        ref : 'category' , 
        required : [true , "subCategory must belong to a mian category"]
    }
} , {timestamps : true})

const subCategoryModel = mongoose.model("subCategory" , subCategorySchema);

module.exports = subCategoryModel ;