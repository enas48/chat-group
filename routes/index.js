const express = require("express");
const router=express.Router();

//-------route to handle homepage request-------------
router.get('/',(req,res,next)=>{  
    res.render(process.cwd()+ '/views/index')
});
module.exports=router;
