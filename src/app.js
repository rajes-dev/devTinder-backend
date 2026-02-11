const express = require("express");
const { DbConnect } = require("./config/database");
const app = express();
const user = require("./models/user");
const {validateSignupData} = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
// const jwt = require('jsonwebtoken');
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
    console.log("user created successsfully");
    res.send("user creataed success");
  } catch (err) {
    res.status(400).send('Error :'+ err.message)
  }
});

app.post("/login", async (req,res)=>{

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
})

app.get("/profile", userAuth, async(req, res)=>{
  
   try{
  const userProfile = req.user;
    res.send('cookie sent : '+ userProfile)
   }catch(err){
    res.status(400).send('user not fetched')
};
})


DbConnect()
  .then(() => {
    console.log("DB connection established successfull");
    app.listen(7777, () => {
      console.log("listening on 7777");
    });
  })
  .catch((err) => {
    console.log("database connection not established");
  });

// mongodb+srv://namastedev:QwRD0dQ47FArzY04@namastenode.tqtnu8y.mongodb.net/
