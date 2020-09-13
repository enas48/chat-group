const express = require("express");
const router=express.Router();
const passport=require('passport');
const bcrypt= require('bcrypt');
const ObjectID=require('mongodb').ObjectID;



/*--------------router for request login page--------------------*/
router.get('/login',(req,res,next)=>{
     const messages=req.flash();     
     res.render(process.cwd()+ '/views/login',{messages})    
});


/*--------------handle login page request--------------------*/
router.post('/login', passport.authenticate('local', 
  { failureRedirect: '/auth/login', 
    failureFlash: 'Wrong name or password'}), (req, res, next) => {
  res.redirect('/users');
});


/*--------------router for request register page--------------------*/
router.get('/register',(req,res,next)=>{
    const messages=req.flash();     
    res.render(process.cwd()+ '/views/register',{messages})
   
});


/*--------------handle register newuser request--------------------*/
router.post('/register',(req,res,next)=>{
    var hash=bcrypt.hashSync(req.body.password,12);
    const users = req.app.locals.users;
    users.findOne({username:req.body.username},(err,user)=>{
        if(err){
            next(err);
          }else if(user){
            req.flash('error', 'User account already exists.');
            res.redirect('/auth/register');
          }else{
            users.insertOne(
              {email:req.body.email
                ,password:hash,
                username:req.body.username
                ,bio:'',
                phone:'',
                created_on: new Date(),
                photo:{img:'../public/images/profile-default.jpg'}
              },(err,doc)=>{
                if(err){
                  res.redirect('/auth/register');
                }else{
                  req.flash('success', 'User account registered successfully. log in now');
                  res.redirect("/users");
                  next(null,doc);
                }
            })
        }
    })
},passport.authenticate('local', { failureRedirect: '/auth/register'}), 
    (req, res) => {
      res.redirect("/users");
    });


 //--------------valid username before sent to database ajax response-----------
router.post('/validname',function(req,res){
  console.log(req.body.username);
  const users = req.app.locals.users;
  users.findOne({username:req.body.username},(err,user)=>{
    if(user){
      res.send('taken');
    }else{
      res.send('not-taken');
    }
  });
});


 //--------------valid updated username before sent to database ajax response-----------
 router.post('/validUpdateName',function(req,res){
  const users = req.app.locals.users;
  users.findOne({username:req.body.usernameUpdate},(err,user)=>{
    if(user){
      //check if user not update his name and still with samename
      if(user.username === req.body.username){
        console.log('same name');
        res.send('not-taken');
      }else{
      res.send('taken');
      }
    }else{
      res.send('not-taken');
    }
  });
});


//-------------logout route------------
router.get('/logout',(req,res)=>{
    req.logOut();
     res.redirect('/');    
});


module.exports=router;
