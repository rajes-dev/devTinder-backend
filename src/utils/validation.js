
const validator = require('validator');

const validateSignupData = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error('Invalid first last names');
    }else if(!validator.isEmail(emailId)){
     throw new Error('Invalid email')
    }else if(!validator.isStrongPassword(password)){
     throw new Error('enter a strong password')
    }
}

const validateUpdateUserData = (req)=>{
 const allowedUserDataToUpdate = [
        "age","firstName","lastName","email","about","skills","phtotUrl","gender"
    ];
    const isUpdateAllowed = Object.keys(req.body).every((field)=> allowedUserDataToUpdate.includes(field));

   return isUpdateAllowed;

}


module.exports = {validateSignupData,validateUpdateUserData};