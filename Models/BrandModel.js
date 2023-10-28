const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true , "Brand name is required"],
        unique : [true , "Brand must be unique"],
        minLength : [4 , "Brand name at least 4 characters"],
        maxLength : [35 , "Brand name maximum 35 characters"]
    },slug : {
        type : String , 
        lowercase : true
    },
    image : String
} , {timestamps : true
})

// mongoose middleware to return image path in response
const setImageURL = (doc)=>{
    if(doc.image){
        let imageURL
        if(process.env.NODE_ENV === 'development'){
            imageURL = `${process.env.DEV_BASE_URL}/Brand/${doc.image}`
        }else{
            imageURL = `${process.env.PRO_BASE_URL}/Brand/${doc.image}`
        }
        doc.image = imageURL;
    }
}
// 1- getOne - getAll - update
brandSchema.post('init', (doc)=> {
   setImageURL(doc);
});
// 2- Create
brandSchema.post('save', (doc)=> {
   setImageURL(doc);
});
const brandModel = mongoose.model("Brand" , brandSchema);
module.exports = brandModel ;