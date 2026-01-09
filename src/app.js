const express = require("express");
const {DbConnect} = require('./config/database');
const app = express();

const {auth} = require('./middlewares/auth');

DbConnect().then(()=>{
     console.log('connection established successfull');
     app.listen(7777, ()=>{
    console.log('listening on 7777')
});
}).catch((err)=>{
  console.log('database connection not established')
})


// mongodb+srv://namastedev:QwRD0dQ47FArzY04@namastenode.tqtnu8y.mongodb.net/


