const express = require("express");
const { DbConnect } = require("./config/database");
const app = express();
const user = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    //creating a new instance of the user model
  const User = new user(req.body);

  try {
    await User.save();
    console.log("user created successsfully");
    res.send("user creataed success");
  } catch (err) {
    res.status(400).send('user not created:'+ err.message)
  }
});

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

app.patch('/user', async(req, res)=>{
    const userId = req.body.userId
    const data = req.body
    try{
        await user.findByIdAndUpdate({_id: userId}, data);
        res.send('user updated successfully')
    }catch(err){
    res.status(400).send('user not fetched')
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
