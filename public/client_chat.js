$(document).ready(function(){
 //global io
 var socket =io();

 //for responsive sidebar
    $('#sidebarCollapse').on('click',()=>{
        $('#sidebar').toggleClass('active');
    });
    

  /*------------------------ emit message value to backend---------------*/ 
  $('#message-form').submit(function(){
      var messageToSend=$('#m').val();
      socket.emit('chat message',{message:messageToSend});
      $('#m').val('');
      return false;   //prevent form submit and refresh page
  });





     /*-------------------put online state on users who are online-----------------*/
  socket.on('available users', function(data){
    //all user in app
    const allusers=$('.member-name').toArray();

    allusers.forEach((user)=>{
        $(user).removeClass('active-user'); 
        
        //online users
        const onlineusers =data.availableUsers;

        onlineusers.forEach((onlineUser)=>{
            //if online user name equal to app user name  add class active 
            if(onlineUser.name === $(user).html()){
                //console.log('active');
                $(user).addClass('active-user');
            }
        });
    });
});


//-----------callback function to show message in ui
  function showMessages(data){
    var username=$.trim($('#username-chat').text());
      if(data.name=== username){
          messageColor='bg-primary'
      }else{
        messageColor='bg-secondary'
      }
    $('#messages').append(`
    <li class="shadow-lg ${messageColor} d-flex mb-4 p-2 rounded-lg align-items-top message-box">
         <img class="dropdown-img img-fluid rounded-circle mr-2" src=${data.photo.img} >
         <div class="message">                
             <h5 class="text-capitalize text-white"> ${data.name} <span class="pl-1 time text-light">${data.time}</h5>
             <p class="text-break"> ${data.message}</p> 
         </div>   
    </li>`);
    $('#content').scrollTop($('#content').prop('scrollHeight')) ;
}


  /*-------------------retrive old messages-----------------------*/
  socket.on('output old messages',function(data){
    data.forEach((msg)=>{
    showMessages(msg);
   })
}) 

/*------------------------ notification when user join or leave chat---------------*/
socket.on('user',function(data){
    var message =data.name;
    if(data.connected){
        message+= ' has joined the chat';
    }else{
      message+= ' has left the chat'; 
    }
    $('#messages').append(`
    <li class="shadow-lg bg-secondary d-flex mb-4 p-2 rounded-lg align-items-top message-box">${message}</li>`)
    $('#content').scrollTop($('#content').prop('scrollHeight')) ;
});
    

/*----------------------- put username and massage --------------------*/
    socket.on('output messages',function(data){
         showMessages(data);
         //scroll to last message 
 
    });


/*---------------notification when Someone is typing----------------*/
  $('#m').on('keypress',()=>{
      socket.emit('typing');
  })

  socket.on('notify typing',(data)=>{
    $('#typing').text(`${data.username} is typing a message`)
})


/*-----------------notification when stop typing----------------------*/
$('#m').on('keyup',()=>{
    socket.emit('stop typing');
})

socket.on('notify stopTyping',(data)=>{
    setTimeout(()=>{
        $('#typing').text('');
    },5000);

})
 

    });