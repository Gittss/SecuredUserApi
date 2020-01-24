const mongoose=require('mongoose');
require('./user.model');

mongoose.connect('mongodb://localhost:27017/securedb',{useNewUrlParser:true}, (err) =>{
    if(!err) console.log('MongoDB Connected')
    else console.log('Error in MongoDB connection : '+err)
});