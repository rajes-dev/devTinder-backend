
const mongoose = require('mongoose');

const DbConnect = async()=>{
    await mongoose.connect('mongodb+srv://namastedev:QwRD0dQ47FArzY04@namastenode.tqtnu8y.mongodb.net/devTinder');
};


module.exports = {DbConnect};

