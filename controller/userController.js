const express=require('express');
var router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model('User');
const jwt=require('jsonwebtoken');

router.use(express.json());

router.get('/', (req,res) => {
    res.render("user/addEdit",{
        viewTitle:"Add User"
    });
});

router.post('/',(req,res) => {
    if(req.body._id=='') addUser(req,res);
    else editUser(req,res);
});

router.get('/login',(req,res) => {
    res.render('user/token');
});

function addUser(req,res){
    var user=new User();
    user.name=req.body.name;
    user.number=req.body.number;
    const SEC_TOKEN=require('crypto').randomBytes(64).toString('hex');
    user.sec_token=jwt.sign({user},SEC_TOKEN);
    user.save((err,doc) => {
        if(!err){
            res.render('user/addEdit',{
                tokenDisplay:'Your security token is : >| '+SEC_TOKEN+' |< copy it for future reference',
                viewTitle:'Added Successfully'
            });
        }
        else{
            if(err.name=='ValidationError'){
                handleValidationError(err,req.body);
                res.render("user/addEdit", {
                    viewTitle:"Add User",
                    user: req.body
                })
            }
            else console.log('Error in adding user '+err);
        }
    })
}

function editUser(req,res){
    User.findOneAndUpdate({_id:req.body._id},req.body,{new:true},(err,doc) => {
        if(!err){
            var user=new User();
            user=req.body;
            const SEC_TOKEN=require('crypto').randomBytes(64).toString('hex');
            user.sec_token=jwt.sign({user},SEC_TOKEN);
            User.findOneAndUpdate({_id:user._id},user,{new:true},(err,doc) =>{
                res.render('user/addEdit',{
                    viewTitle:'Changes saved',
                    tokenDisplay:'Your new security token is : >| '+SEC_TOKEN+' |< copy it for future reference'
                });
            });
        } 
        else {
            if(err.name == 'ValidationError'){
                handleValidationError(err,req.body);
                res.render("user/addEdit", {
                    viewTitle:'Edit User',
                    user:req.body
                });
            }
            else console.log('Error updating user : '+err);
        }
    });
}

router.post('/token',verifyToken,(req,res) => {
    User.findOne({number:req.body.number},req.body,{new:true},(err,doc) =>{
        res.render('user/login',{
            viewTitle:'Welcome User',
            list:req.doc
        })
    });
});

function verifyToken(req,res,next){
    User.findOne({number:req.body.number},req.body,{new:true},(err,doc) => {
        const SEC_TOKEN=req.body.sec_token;
        if(!doc){
            res.render('user/token',{
                viewTitle:'Number not registered'
            })
        }
        else {
            const token=doc.sec_token;
            if(!SEC_TOKEN){
                res.render('user/token',{
                    viewTitle:'ACCESS DENIED [No Token]'
                })
            }
            else{
                jwt.verify(token,SEC_TOKEN,(err,doc)=> {
                    if(err){
                        res.render('user/token',{
                            viewTitle:'ACCESS DENIED [Invalid Token]'
                        })
                    }
                    else{
                        req.doc=doc;
                        next();
                    }
                });
            }
        }
    });
}

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
            case 'name':    
                body['nameError']=err.errors[field].message;
                break;
            case 'number':
                body['numberError']=err.errors[field].message;
                break;
            case 'sec_token':
                body['sec_tokenError']=err.errors[field].message;
                break
            default: break;
        }
    }
}

router.get('/:id',(req,res) => {
    User.findById(req.params.id, (err,doc) => {
        if(!err){
            res.render("user/addEdit",{
                viewTitle:'Edit User',
                user:doc
            })
        }
    });
});

router.get('/delete/:id',(req,res) => {
    User.findByIdAndRemove(req.params.id, (err,doc)=>{
        if(!err)
          res.render('user/addEdit',{viewTitle:'Deleted Successfully'});
        else console.log('Error in deleting user : '+err);
    });
});

module.exports=router;