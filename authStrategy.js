const ObjectID=require('mongodb').ObjectID;
const bcrypt= require('bcrypt');
const passport=require('passport');

// passport strategy------------
const LocalStrategy=require('passport-local');
const GitHubStrategy = require('passport-github').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;
const GoogleStrategy=require('passport-google-oauth20').Strategy;
const TwitterStrategy=require('passport-twitter').Strategy;

// Configure passport
module.exports = function(app,db){
  

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done)=>{
    done(null,user._id);
});
passport.deserializeUser((id,done)=>{
    db.collection('users').findOne({_id:new ObjectID(id)},(err,doc)=>{
        done(null,doc);
    })
});

  //--------------------local authentication strategy-----------------
  passport.use(new LocalStrategy(
    function(username,password,done){
        db.collection('users').findOne({username:username},
          function(err,user){
              console.log('User ' + username + ' attempted to login');
              if(err){
                  return done(err)
              }
              if(!user){
                  return done(null,false)
              }
              if(!bcrypt.compareSync(password,user.password)){
                  return done(null,false)
              }
              return done(null,user);
})
}
));

  //---------------------facebook authentication strategy-----------------
  passport.use(new FacebookStrategy({
    clientID:process.env.FACEBOOK_CLIENT_ID,
    clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: '/auth/facebook/callback'
  },function(accessToken, refreshToken, profile, cb) {
    db.collection('users').findOneAndUpdate(
        {id: profile.id},
        {$setOnInsert:{
            id: profile.id,
            username: profile.displayName || 'John Doe',
            created_on: new Date(),
            provider: profile.provider || '',
            photo:{img:'../public/images/profile-default.jpg'},
            bio:'',
            phone:'',
        },$set:{
            last_login: new Date()
        },$inc:{
            login_count: 1
        }},
        {upsert:true, new: true}, //Insert object if not found, Return new object after modify
        (err, doc) => {
            return cb(null, doc.value);
        }
    );
  }
  ));


    //--------------------github authentication strategy--------------
     passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
          db.collection('users').findOneAndUpdate(
              {id: profile.id},
              {$setOnInsert:{
                  id: profile.id,
                  username: profile.displayName || 'John Doe',
                  created_on: new Date(),
                  provider: profile.provider || '',
                  photo:{img: profile.photos[0].value || '../public/images/profile-default.jpg'},
                  bio:'',
                  phone:'',
              },$set:{
                  last_login: new Date()
              },$inc:{
                  login_count: 1
              }},
              {upsert:true, new: true}, //Insert object if not found, Return new object after modify
              (err, doc) => {
                  return cb(null, doc.value);
              }
          );
        }
    ));

    //--------------------google authentication strategy---------------------
    passport.use(new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        db.collection('users').findOneAndUpdate(
            {id: profile.id},
            {$setOnInsert:{
                id: profile.id,
                username: profile.displayName || 'John Doe',
                photo:{img: profile.photos[0].value || './public/images/profile-default.jpg'},
                created_on: new Date(),
                provider: profile.provider || '',
                bio:'',
                phone:'',
            },$set:{
                last_login: new Date()
            },$inc:{
                login_count: 1
            }},
            {upsert:true, new: true}, //Insert object if not found, Return new object after modify
            (err, doc) => {
                return cb(null, doc.value);
            }
        );
      }
    ));

}