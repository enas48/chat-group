const passport=require('passport');

module.exports=function(app){

   //---------------------facebook route
   app.get('/auth/facebook',passport.authenticate('facebook'));
   app.get('https://chat-group12.herokuapp.com/auth/facebook/callback',
   passport.authenticate('facebook', { failureRedirect: '/auth/register' }),
   function(req, res) {
   // Successful authentication, redirect users page
   //  req.session.user_id = req.user.id;
       res.redirect('/users');
   });

     
     //---------------------github route-------------------------
   app.get('/auth/github',passport.authenticate('github'));
   app.get('https://chat-group12.herokuapp.com/auth/github/callback',
   passport.authenticate('github', { failureRedirect: '/auth/register' }),
   function(req,res)  {
     res.redirect('/users');
    });


   //-------------------------google route--------------------------
     app.get('/auth/google',passport.authenticate('google', { scope: ['profile'] }));
     app.get('https://chat-group12.herokuapp.com/auth/google/callback', 
     passport.authenticate('google', { failureRedirect: '/auth/register' }),
     function(req, res) {
       res.redirect('/users');
     });
     }