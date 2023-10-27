const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true , "Category name is required"],
        unique : [true , "Category must be unique"],
        minLength : [4 , "category name at least 4 characters"],
        maxLength : [35 , "category name maximum 35 characters"]
    },slug : {
        type : String , 
        lowercase : true
    },
    image : String
} , {timestamps : true})

// mongoose middleware to return image path in response
const setImageURL = (doc)=>{
    if(doc.image){
        const imageURL = `${process.env.BASE_URL}/category/${doc.image}`
        doc.image = imageURL;
    }
}
// 1- getOne - getAll - update
categorySchema.post('init', (doc)=> {
   setImageURL(doc);
});
// 2- Create
categorySchema.post('save', (doc)=> {
   setImageURL(doc);
});
const categoryModel = mongoose.model("category" , categorySchema);

module.exports = categoryModel;