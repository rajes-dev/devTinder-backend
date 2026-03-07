const express = require("express");
const authRouter = express.Router();
const {validateSignupData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const user = require("../models/user");

authRouter.post("/signup", async (req, res) => {
   try {
    //validation of data
      validateSignupData(req);

      const { firstName, lastName, emailId,password} = req.body;
      const passwordHash = await bcrypt.hash(password, 10);

    //creating a new instance of the user model
    const User = new user({
      firstName, lastName, emailId, password:passwordHash
    });

    await User.save();
   
    res.send("user creataed success");
  } catch (err) {
    res.status(400).send('Error :'+ err.message)
  }
});
authRouter.post("/login", async (req,res)=>{

  try{
   const {emailId, password} = req.body;

   const foundUser = await user.findOne({emailId: emailId});

   if(!foundUser){
    throw new Error('Invalid creds1')
   }
   const isPasswordvalid = await foundUser.validatePassword(password); 

   if(isPasswordvalid){
    //create a JWT token
    const token = await foundUser.getJWT();

    //add the token to cookie and send response to user
    res.cookie("token", token,{
      expires: new Date(Date.now() + 8* 3600000),
    });
    res.send('Login success!!');
   }else{
    throw new Error('Invalid creds2'); 
   };
  }catch(err){
    console.log(err)
    res.status(400).send('Invalid Credentials'+ err)
}
});

authRouter.post("/logout", (req,res)=>{
  res.cookie('token', null, {
    expires: new Date(Date.now())
  })

  res.send("Logged out successfully")
})

module.exports = authRouter;