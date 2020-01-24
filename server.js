require('./models/db');
const express=require('express');
const bodyparser=require('body-parser');
const exphand=require('express-handlebars');
const path=require('path');
const userController=require('./controller/userController');
const jwt=require('jsonwebtoken');

var app=express();
app.use(bodyparser.urlencoded({
    extended:true
}));
app.use(bodyparser.json());

app.set('views',path.join(__dirname,'/views/'));    
app.engine('hbs',exphand({extname:'hbs', defaultLayout:'main', layoutsDir:__dirname + '/views/layouts/' }));
app.set('view engine','hbs');

app.listen(3002, ()=> {
    console.log('Express server started at port : 3002')
});

app.use('/user',userController);
