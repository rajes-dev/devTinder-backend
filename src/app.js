const express = require("express");
const { DbConnect } = require("./config/database");
const app = express();
const user = require("./models/user");

const { auth } = require("./middlewares/auth");

app.post("/signup", async (req, res) => {
  const User = new user({
    firstName: "Rajesh",
    lastName: "Jami",
    emailId: "raj@gmail.com",
    password: "raj@jami",
  });

  try {
    await User.save();
    console.log("user created successsfully");
    res.send("user creataed success");
  } catch (err) {
    res.status(400).send('user not created:'+ err.message)
  }
});

DbConnect()
  .then(() => {
    console.log("connection established successfull");
    app.listen(7777, () => {
      console.log("listening on 7777");
    });
  })
  .catch((err) => {
    console.log("database connection not established");
  });

// mongodb+srv://namastedev:QwRD0dQ47FArzY04@namastenode.tqtnu8y.mongodb.net/
