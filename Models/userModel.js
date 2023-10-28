const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : [true , "Name is required"]
    },
    slug :{
        type : String,
        lowerCase : true
    },
    email : {
        type : String , 
        required : [true , "Email is required"],
        unique : true,
        lowerCase : true
    },
    password :{
        type : String,
        required : [true , "Password is required"],
        minLength : [6 , "password at least 6 characters"]
    },
    role :{
        type : String,
        enum : ['user' , 'admin' , 'manager'],
        default : 'user'
    },
    passwordChangedAt : Date ,
    passwordResetCode : String,
    passwordResetExpire : Date,
    passwordResetVerified : Boolean,
    phone : {
        type : String ,
    },
    active :{
        type : Boolean,
        default : true
    },
    profileImage : String,
    wishList : [{
        type : mongoose.Schema.ObjectId ,
        ref : 'Product'
    }],
    addresses : [
        {
            id : {type : mongoose.Schema.Types.ObjectId},
            alias : String ,
            details : String ,
            city : String ,
            postalCode : String,
            phone : String
        }
    ]

} , {timestamps : true});

userSchema.pre('save' , async function(next){
    // if(!this.password.isModified('password')) return next()
    // hashing passowrd
        if(!this.isModified('password')){
            return next()
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(this.password , salt);
        this.password = hashed;
        next(); 
});

// user profile image
const setProfileImage = (doc)=>{
    if(doc.profileImage){
        let imgURL
        if(process.env.NODE_ENV === 'development'){
            imgURL = `${process.env.DEV_BASE_URL}/users/${doc.profileImage}`
        }else{
            imgURL = `${process.env.PRO_BASE_URL}/users/${doc.profileImage}`
        }
        doc.profileImage = imgURL
    }
}
userSchema.post('save' , (doc) =>{
    setProfileImage(doc)
})
userSchema.post('init' , (doc)=>{
    setProfileImage(doc)
})
module.exports = mongoose.model("user" , userSchema);

 