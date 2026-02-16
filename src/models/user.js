
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required:true,
        minLength:3,
        maxLength:50,
    },
    lastName : {
        type : String,
    },
    emailId:{
        type : String,
        lowercase: true,
        trim:true,
        required:true,
        unique:true,
        validator(value){
        if(!validator.isEmail(value)){
            throw new Error('Email is not valid :'+ value)
        }}

    },
    password:{
        type: String,
        required:true,
         validator(value){
        if(!validator.isStrongPassword(value)){
            throw new Error('Enter a strong password :'+ value)
        }}
       
    },
    age:{
        type: Number,
        min:18,

    },
    gender:{
        type: String,
        enum:{
            values:['male', 'female', 'others'],
            message:`{VALUES} is not a valid gender type`
        }
        // validate(value){
        //     if(!['male', 'female', 'others'].includes(value)){
        //         throw new Error('gender not valid');
                
        //     }
        // }
    },
    photoUrl :{
        type:String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s',
         validator(value){
        if(!validator.isURL(value)){
            throw new Error('URL is not valid :'+ value)
        }}
    },
    about:{
        type:String,
        default: 'this is default about the user',
    },
    skills:{
        type:[String]
    }

},{
    timestamps:true
});

userSchema.methods.getJWT = async function (){
    const foundUser = this.user;

   const token =  jwt.sign({_id: this._id}, "DEV@Tinder@790", {expiresIn: "7d"});

   return token;
}

userSchema.methods.validatePassword = async function(password){

    const foundUser = this.user;

    const passwordValidate = await bcrypt.compare(password, this.password);

    return passwordValidate;
}

module.exports = mongoose.model('User', userSchema);