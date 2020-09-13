$(document).ready(function(){
 //global io
 var socket =io();

 //for responsive sidebar
    $('#sidebarCollapse').on('click',()=>{
        $('#sidebar').toggleClass('active');
    });
    

  /*------------------------ emit message value to backend---------------*/ 
  $('#message-form').submit(function(){
      var massageToSend=$('#m').val();
      socket.emit('chat message',massageToSend);
      $('#m').val('');
      return false;   //prevent form submit and refresh page
  });


  /*------------------------ number of user who are connected now---------------*/
  socket.on('user',function(data){
      $('#num-users').text(data.currentUsers === 1? data.currentUsers + ' user online' : data.currentUsers + ' users online');
      var message =data.name;
      if(data.connected){
          message+= ' has joined the chat';
      }else{
        message+= ' has left the chat'; 
      }
      $('#messages').append(`<li class="shadow-lg bg-primary d-flex mb-4 p-2 rounded-lg align-items-top message-box">${message}</li>`);
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


/*----------------------- put username and massage --------------------*/
    socket.on('chat message',function(data){
    
        $('#messages').append(`
        <li class="shadow-lg bg-secondary d-flex mb-4 p-2 rounded-lg align-items-top message-box">
             <img class="dropdown-img img-fluid rounded-circle mr-2" src=${data.photo.img}>
             <div class="message">                
                 <h5 class="text-capitalize text-white"> ${data.name} <span class="pl-1 time text-muted">${data.time}</h5>
                 <p class="text-break"> ${data.message}</p> 
             </div>   
        </li>`);
         //scroll to last message 
        $('#content').scrollTop($('#content').prop('scrollHeight')) ;
    })

    

    });