const express = require("express");
const { DbConnect } = require("./config/database");
const app = express();
const user = require("./models/user");
const {validateSignupData} = require("./utils/validation")
const bcrypt = require("bcrypt");

app.use(express.json());

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
   const isPasswordvalid = await bcrypt.compare(password, foundUser.password);

   if(isPasswordvalid){
    res.send('Login success!!'); 
   }else{
    throw new Error('Invalid creds2'); 
   }
  }catch(err){
    res.status(400).send('Invalid Credentials'+ err)
}
})

app.get("/user", async (req, res)=>{
    const userEmail = req.body.emailId;
try{ 
     const fetchedUser = await user.find({emailId: userEmail})
     if(fetchedUser.length === 0){
        res.status(400).send('user not found')
     }else{
 res.send(fetchedUser)
     }
    

}catch(err){
    res.status(400).send('user not fetched')
}

});

// get/feed get all user api
app.get('/feed', async(req, res)=>{

    try{
        const fetchedUser = await user.find({});
        res.send(fetchedUser)
    }catch(err){
    res.status(400).send('user not fetched')
}
});

// delete api
app.delete('/user', async(req, res)=>{
    const userId = req.body.userId;
    try{
        const  getUsertoDelete = await user.findByIdAndDelete({_id: userId});
        res.send('user deleted')
    }catch(err){
    res.status(400).send('user not fetched')
}
});

app.patch('/user/:userId', async(req, res)=>{
    const userId = req.params?.userId
    const data = req.body
    try{
      const allowedUpdates = ['age', 'photoUrl', 'about', 'skills'];

      const isUpdateAllowed = Object.keys(data).every((k) => allowedUpdates.includes(k));
      if(!isUpdateAllowed){
        throw new Error('update not allowed')
      }
      if(data.skills.length > 10){
        throw new Error('max skills allowed 10')
      }
        await user.findByIdAndUpdate({_id: userId}, data,{
          returnDocument: "after",
          runValidators: true, 
        }); 
        res.send('user updated successfully')
    }catch(err){
    res.status(400).send('update failed ' + err.message)
}
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
