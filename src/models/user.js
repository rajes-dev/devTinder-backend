
const mongoose = require('mongoose');

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
    },
    password:{
        type: String
    },
    age:{
        type: Number,
        min:18,

    },
    gender:{
        type: String,
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error('gender not valid');
                
            }
        }
    },
    photoUrl :{
        type:String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s',
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

module.exports = mongoose.model('User', userSchema);