//----------require all modules--------------
require('dotenv').config();
const express = require("express");
const bodyParser=require("body-parser");
const cors=require('cors');
const mongo=require('mongodb').MongoClient;
const session =require('express-session');
const sessionStore= new session.MemoryStore();
const passportSocketIo=require('passport.socketio');
const cookieParser=require('cookie-parser');
const flash = require('connect-flash');
const multer=require("multer");
const path=require('path');
const http = require('http');
const moment = require('moment');


//--------------make an express app--------------
const app = express();

// ------------HTTP server-----------------
const server = http.createServer(app);


const HTTP_PORT = process.env.PORT || 3000;


//-------------set template engine-------------
  app.set('view engine','pug');


 //--------------authentication middleware-----------
 const auth=require('./authStrategy');

//----------------require our routes handler--------------
const homeRoute=require('./routes/index');
const authRoute=require('./routes/auth');
const userRoute=require('./routes/users');
const chatRoute=require('./routes/chat');
const socialRoute=require('./routes/social');

//--------------------middleware---------------------- 
app.use("/public", express.static(__dirname + "/public"));
app.use("/users/public/photo-storage", express.static(__dirname + "/public/photo-storage"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized:true,
    key: 'express.sid',
    store: sessionStore
  }));

 

//---------------------connect to database------------------
mongo.connect(process.env.DATABASE, {useUnifiedTopology: true},(err,client)=>{
      let db = client.db('chatGroupapp');
      const users = db.collection('users');
      const chatMessage=db.collection('chatMessage');
      //save database in app to use it later
      app.locals.users = users;
      
    if(err){
      console.log('database error' + err);
    }else{
      console.log('successful database connection');
 //---------authentication strategy------
 auth(app,db);

 //--------------social routes
 socialRoute(app);

 //--------routers handler---------------
 app.use('/',homeRoute);
 app.use('/users',userRoute);
 app.use('/auth',authRoute)
 app.use('/chat',chatRoute);



 //----catch 404 and forward to error handler
 app.use((req,res,next)=>{
   res.status(404).type('text').send('not found');
 });

/* -----------------connect to HTTP server-----------*/
server.listen(HTTP_PORT, () => {
  console.log('server started at 3000');
});

/*-------------start socket.io code--------------------*/ 

//--------setup socket.io
const io=require('socket.io')(server);

//-------authenticate with socket
io.use(passportSocketIo.authorize({
  cookieParser:cookieParser,
  key: 'express.sid',
  secret:process.env.SESSION_SECRET,
  store:sessionStore
})); 


var onlineusers=[]
io.on('connection',socket=>{

  /*------------------------ get chats from mongodb collection----------------------*/
      chatMessage.find().limit(100).toArray((err,data)=>{
        if(err){throw err}
        // emit old mesaages when user connect
        socket.emit('output old messages',data) ;
    
      });
    
   /*---------------emit current users cpnnected-------------------*/
   console.log('user ' + socket.request.user.username + ' connected')
   socket.broadcast.emit('user',{name: socket.request.user.username,connected:true});
   
   
    /*--------------emit online users in app to change state--------------------*/
    onlineusers.push({name: socket.request.user.username});
    console.log(onlineusers);
    io.emit('available users', {availableUsers:onlineusers});   



   /*-------------listen to socket for comming chat message---------------*/
   socket.on('chat message',(data)=>{
    const username=socket.request.user.username;
    const recivedMessage=data.message;

    //find user on database and take his info(photo) to send to all users
      users.findOne({username},function(err,recent){
        if(err){throw err};
          var photo = recent.photo;
          var  time=moment().format('h:mm a');

          if(username==='' || recivedMessage ===''){
            console.log('please sent name or message');

          }else{
                //add message to data base
          chatMessage.insertOne({name:username,message:recivedMessage,time,photo},function(){
            
              //when recived message and photo we emit the event to all sockets
            io.emit('output messages',{name:username,message:recivedMessage,time,photo})
          });
          }
      });
 }) ;


 /*-------------------listen when Someone is typing msg--------------------*/
 socket.on('typing',(data)=>{
   socket.broadcast.emit('notify typing',{username:socket.request.user.username})
 })

 /*-------------------listen when stop typing--------------------*/
 socket.on('stop typing',(data)=>{
  socket.broadcast.emit('notify stopTyping')
})


  socket.on('disconnect',()=>{
     /*---------------emit notification when user left chat------------------*/
     console.log('user ' + socket.request.user.username + ' disconnected')
     io.emit('user',{name:socket.request.user.username,connected:false});

     /*---------------emit online users state after one user disconnect-------------------*/
      onlineusers = onlineusers.filter((elem)=>{
      return elem.name !== socket.request.user.username;
    });
     console.log(onlineusers);
     io.emit('available users', {availableUsers:onlineusers});

  });
});  
}
});




