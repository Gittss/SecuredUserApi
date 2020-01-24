const mongoose=require('mongoose');

var userSchema= new mongoose.Schema({
    number:{type:String, required:'Field is required'},
    sec_token:{type:String,required:'Field is required'},
    name:{type:String, required:'Field is required'}
});

mongoose.model('User',userSchema);