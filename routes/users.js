const express = require("express");
const router=express.Router();
const passport=require('passport');
const bcrypt= require('bcrypt');
const ObjectID=require('mongodb').ObjectID;
const multer=require("multer");
const path=require('path');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };


  /*'-------------route for profile page----------------*/
  router.get('/',ensureAuthenticated,(req,res)=>{
    const _id=ObjectID(req.session.passport.user);
    const users = req.app.locals.users;
    users.findOne({_id},(err,result)=>{
        if(err){throw err}
        res.render(process.cwd() + '/views/profile',{...result});
    });

});


/*---------------- route for update profile page-----------*/
router.get('/update',ensureAuthenticated,(req,res)=>{
res.render(process.cwd() + '/views/edit',{
    username:req.user.username,
    photo: req.user.photo

});
   
})


//------------MULTER CONFIG: to get file photos to temp server storage----------  
const multerConfig = {
    storage: multer.diskStorage({
       //Setup where the user's file will go
       destination:'public/photo-storage/',
        //Then give the file a unique name
        filename: function(req, file, cb){
            cb(null, file.fieldname + '-' + Date.now() + '.'+ path.extname(file.originalname));  
        },
        fileFilter:function(req,file,cb){
          //Allowed ext
          const filetypes=/jpeg|png|jpg|gif/
          //check ext
          const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
         //check mime
         const mimetype=filetypes.test(file.mimetype);
         if(mimetype & extname){
             return cb(null,true);
         }else{
             cb('error:images only')
         }
        }
    })
  
  }


/*---------------- handle updating userprofile------------*/
const uploadPhoto=multer(multerConfig).single('photo');
router.post('/update',ensureAuthenticated, uploadPhoto,(req,res,next)=>{

const {username,bio,phone,email}=req.body;
const photo={img:req.file.path};
const _id=ObjectID(req.session.passport.user);
const users = req.app.locals.users;

users.updateOne({_id},{
    $set:{username,bio,phone,email,photo}
},(err)=>{
    if(err){throw (err)
    }
    console.log(req.file);
   
    res.redirect('/users') ;      
}
)
})



/*---------------- get puplic profile for any user------------*/
router.get('/:username',ensureAuthenticated,(req,res,next)=>{
    const username=req.params.username;
    const users = req.app.locals.users;
    users.findOne({username},(err,results)=>{
        if(err || !results){
            res.render(process.cwd() + '/views/public_profile',{ messages:{error:['user not found']}});        
        }
        const messages=req.flash();  
        console.log(req.user.photo)
        console.log(results.photo);
        res.render(process.cwd() + '/views/public_profile',{...results,name:req.user.username,messages,userphoto:req.user.photo});
    })
});



module.exports=router;