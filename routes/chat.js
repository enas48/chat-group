const express = require("express");
const router=express.Router();

//-------route to handle chat request-------------
router.get('/',(req,res,next)=>{
    const users = req.app.locals.users;
    users.find().toArray((err,recent)=>{
        res.render(process.cwd()+ '/views/chat',{recent,username:req.user.username,photo:req.user.photo})
    });
});



module.exports=router;