const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
// const { Error } = require("mongoose");
const {validateUpdateUserData} = require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const userProfile = req.user;
    res.send("cookie sent : " + userProfile);
  } catch (err) {
    res.status(400).send("user not fetched");
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
    // console.log(req)
  try {
    if (!validateUpdateUserData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    
    Object.keys(req.body).forEach((key)=> loggedInUser[key] = req.body[key]);
    await loggedInUser.save();
   
    res.json({message: `${loggedInUser.firstName}, your profile updated successfully`, data:loggedInUser})

  } catch (err) {
    res.status(400).send(err.message)
  }
});

profileRouter.patch("/profile/password", userAuth, async (req,res)=>{

    try{
        if(!req.body.newPassword){
            throw new Error("password cannot be empty")
        }
    req.user.password = req.body.newPassword;
     await req.user.save();
     res.send("Password updated successfully");
    }catch(err){
        res.status(400).send("password update not successfull")
    }
    
});

module.exports = profileRouter;
