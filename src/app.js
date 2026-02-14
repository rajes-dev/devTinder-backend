const express = require("express");
const { DbConnect } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequest = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequest);


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
