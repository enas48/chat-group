$(document).ready(function(){
    
        /*--------------------------validate input name-------------------*/
        //----------------------------------------------------------------

  function validation(){
        var usernameState = false;
        var useremailState=false;
        var userpasswordState=false;
        

          
        $('#register-name').blur(function(){   
          var username = $(this).val();
          console.log(username);
          // validate input name in database if length > 2
          if(username.length > 2){
              $.ajax({
                  url:'/auth/validname',
                  method: 'POST',
                  data:JSON.stringify({username:username}),
                  contentType:'application/json',
                  success:function(response){

                      //if name not in database
                      if(response==='not-taken'){
                          usernameState=true;
                          $('.name-err-msg').removeClass("text-danger");
                          $('.name-err-msg').addClass("text-success p-1");
                          $('#register-name').addClass('valid');
                          $("#register-name").removeClass('error');
                          $('.name-err-msg').html('<span class="material-icons">check</span>');
                   
                    //if name in database
                       } else if(response==='taken'){
                          usernameState=false;
                          $('.name-err-msg').removeClass("text-success");
                          $('.name-err-msg').addClass("text-danger p-1");
                          $('#register-name').removeClass('valid');
                          $('#register-name').addClass('error');
                          $('.name-err-msg').html(`<span class="material-icons">close</span>
                          <span class="align-top">Sorry... Username already taken.</span>`);
                      }
                  }})

                  //if input name length < 3
              }else{
                  usernameState=false;
                  $('.name-err-msg').removeClass("text-success");
                  $('.name-err-msg').addClass("text-danger p-1");
                  $('#register-name').removeClass('valid');
                  $('#register-name').addClass('error');
                  $('.name-err-msg').html(`<span class="material-icons">close</span>
                  <span class="align-top">Please enter at least 3 characters.</span>`);
              }});




        $('#update-name').blur(function(){   
          var usernameUpdate = $(this).val();
          var username = $.trim($('#username').text());
          console.log($(this).val());
          console.log($.trim($('#username').text()));
          // validate input name in database if length > 2
          if(usernameUpdate.length > 2){
              $.ajax({
                  url:'/auth/validUpdateName',
                  method: 'POST',
                  data:JSON.stringify({username:username,usernameUpdate:usernameUpdate}),
                  contentType:'application/json',
                  success:function(response){

                      //if name not in database
                      if(response==='not-taken'){
                          usernameState=true;
                          $('.name-update-msg').removeClass("text-danger");
                          $('.name-update-msg').addClass("text-success p-1");
                          $('#update-name').addClass('valid');
                          $("#update-name").removeClass('error');
                          $('.name-update-msg').html('<span class="material-icons">check</span>');
                   
                    //if name in database
                       } else if(response==='taken'){
                      
                          usernameState=false;
                          $('.name-update-msg').removeClass("text-success");
                          $('.name-update-msg').addClass("text-danger p-1");
                          $('#update-name').removeClass('valid');
                          $('#update-name').addClass('error');
                          $('.name-update-msg').html(`<span class="material-icons">close</span>
                          <span class="align-top">Sorry... Username already taken.</span>`);
                      
                    }
                  }})
                
                  //if input name length < 3
              }else{
                  usernameState=false;
                  $('.name-update-msg').removeClass("text-success");
                  $('.name-update-msg').addClass("text-danger p-1");
                  $('#update-name').removeClass('valid');
                  $('#update-name').addClass('error');
                  $('.name-update-msg').html(`<span class="material-icons">close</span>
                  <span class="align-top">Please enter at least 3 characters.</span>`);
              }}); 


        $('#update-phone').keyup(function(){
          var userPhone=$(this).val();
          var regex=/^[0-9]{10}$/;
          if(userPhone.match(regex)){
            $('.phone-err-msg').removeClass("text-danger");
            $('.phone-err-msg').addClass("text-success p-1");
            $('#update-phone').addClass('valid'); 
            $('#update-phone').removeClass('error'); 
            $('.phone-err-msg').html('<span class="material-icons">check</span>');

          }else{
            $('.phone-err-msg').removeClass("text-success");
            $('.phone-err-msg').addClass("text-danger p-1");
            $('#update-phone').removeClass('valid');
            $('#update-phone').addClass('error');
             $('.phone-err-msg').html(`<span class="material-icons">close</span>
            <span class="align-top">please input valid phone</span>`);
          }

        })
            
            /*----------------------validate input email ------------------*/
            //---------------------------------------------------------------
            function validEmail(){
              var userEmail = $(this).val();
              var regex=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              
              // validate email in database if email match regex
              if(userEmail.match(regex)){
                
                useremailState=true;
                $('.email-err-msg').removeClass("text-danger");
                $('.email-err-msg').addClass("text-success p-1");
                $('#register-email,#update-email').addClass('valid'); 
                $('#register-email,#update-email').removeClass('error');
                $('.email-err-msg').html('<span class="material-icons">check</span>');
                  
                      
                  } // if not match regex
                  else{
                      $('.email-err-msg').removeClass("text-success");
                      $('.email-err-msg').addClass("text-danger p-1");
                      $('#register-email,#update-email').removeClass('valid');
                      $('#register-email,#update-email').addClass('error');
                      $('.email-err-msg').html(`<span class="material-icons">close</span>
                      <span class="align-top">Please enter a valid email address.</span>`);
                  }
              }
            $('#register-email').keyup(validEmail);
            $('#update-email').keyup(validEmail);
                
                /*-------------------validate input password----------------*/ 
                //-----------------------------------------------------------
                $('#register-password').keyup(function(){   
                    var userPassword = $(this).val();
                    var regexOneWeak=/(?=.*[a-zA-Z])/;
                    var regexTwoWeak=/^(?=.*[0-9!@#$%^&*])/;
                    var regexMeduim=/^(?=.*[0-9!@#$%^&*])(?=.*[a-zA-Z])/;
                    var regexStrong= /^(?=.*[0-9!@#$%^&*])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
                    
                    //check if password is not empty
                    if(userPassword !==''){
                        $('.progress').css('display','flex');
                        
                        if(userPassword.match(regexOneWeak)){
                            userpasswordState=false;
                           $('.password-err-msg').removeClass("text-success");
                           $('.password-err-msg').addClass("text-danger p-1");
                           $('#register-password').removeClass('valid');
                           $('#register-password').addClass('error');
                           $('.progress-bar').removeClass('bg-warning bg-success').addClass('bg-danger');
                           $('.progress-bar').width('35%');
                           $('.password-err-msg').html(`<h5>weak password</h5>
                           <ul class="list-unstyled">
                            <li class="text-success">
                               <span class="material-icons">check</span>
                               <span class="align-top">use lower or upper case letters</span> 
                            </li>
                            <li class="text-danger">
                              <span class="material-icons">close</span>
                              <span class="align-top">include at least one number or symbol</span>
                            </li>
                            <li class="text-danger">
                              <span class="material-icons">close</span>
                              <span class="align-top">use at least 7 characters long</span>
                            </li> 
                           </ul>`);
                        }
                        
                        if(userPassword.match(regexTwoWeak)){
                             userpasswordState=false;
                             $('.password-err-msg').removeClass("text-success");
                             $('.password-err-msg').addClass("text-danger p-1");
                             $('#register-password').removeClass('valid');
                             $('#register-password').addClass('error');
                             $('.progress-bar').removeClass('bg-warning bg-success').addClass('bg-danger');
                             $('.progress-bar').width('35%')
                             $('.password-err-msg').html(`<h5>weak password</h5>
                             <ul class="list-unstyled">
                              <li class="text-danger">
                                <span class="material-icons">close</span>
                                <span class="align-top">use lower or upper case letters</span> 
                              </li>
                              <li class="text-success">
                                <span class="material-icons">check</span>
                                <span class="align-top">include at least one number or symbol</span>
                              </li>
                              <li class="text-danger">
                                <span class="material-icons">close</span>
                                <span class="align-top">use at least 7 characters long</span>
                             </li> 
                          </ul>`);
                        }
                        
                        if(userPassword.match(regexMeduim)){
                             userpasswordState=false;
                             $('.password-err-msg').removeClass("text-success");
                             $('.password-err-msg').addClass("text-danger p-1");

                             $('#register-password').removeClass('valid');
                             $('#register-password').addClass('error');
                             
                             $('.progress-bar').removeClass('bg-danger bg-success').addClass('bg-warning');
                             $('.progress-bar').width('60%');
                             $('.password-err-msg').html(`<h5 class="text-warning">Medium password</h5>
                             <ul class="list-unstyled">
                               <li class="text-success">
                                 <span class="material-icons">check</span>
                                 <span class="align-top">use lower or upper case letters</span> 
                               </li>
                               <li class="text-success">
                                 <span class="material-icons">check</span>
                                 <span  class="align-top">include at least one number or symbol</span>
                               </li>
                               <li class="text-danger">
                                 <span class="material-icons">close</span>
                                <span  class="align-top">use at least 7 characters long.</span>
                               </li> 
                            </ul>`);
                        } 
                        
                        if(userPassword.match(regexStrong)){
                            userpasswordState=true;
                            $('.password-err-msg').removeClass("text-danger");
                            $('.password-err-msg').addClass("text-success p-1");
                            $('#register-password').addClass('valid'); 
                            $('#register-password').removeClass('error'); 
                            $('.progress-bar').removeClass('bg-danger bg-warning').addClass('bg-success');
                            $('.progress-bar').width('100%')
                            $('.password-err-msg').html('<span class="material-icons">check</span>');
                  } 
                } 
                //if password is empty
                else{
                  $('.progress').css('display','none');
                  $('.password-err-msg').html("");
              }
            });
            
            
            /*-------------------------------form validation-------------------------------*/
            
            $('#register-form').on('submit',function(e){
                //prevent form submit
                 e.preventDefault();
                var userName= $("#register-name").val();
                var userEmail = $("#register-email").val();
                var userPassword=$("#register-password").val();
                
                if (useremailState== false || usernameState == false || userpasswordState == false) {
                    $('#err-msg').addClass('alert alert-danger').html(`<span class="material-icons">close</span>
                    <span  class="align-top">Fix the errors in the form first</span>`);
                } else{
      // proceed with form submission
      $.ajax({
          url:'/auth/register',
          method:'POST',
          data:JSON.stringify({
               email:userEmail,
              username:userName,
              password:userPassword
            }),
            contentType:'application/json',
            success:function(response){
                 $('#err-msg').removeClass('alert-danger').addClass('alert alert-success').html(`
                 <span class="material-icons">check</span>
                 <span class="align-top">user saved log in now <a href='/auth/login' class='text-primary'>log in </a></span>`);
                 $("#register-name").val('');
                 $("#register-email").val('');
                 $("#register-password").val('');
                 $('.email-err-msg').html('');
                 $('.name-err-msg').html('');
                 $('.password-err-msg').html('');
                 $("#register-name").removeClass('valid error');
                 $("#register-password").removeClass('valid error');
                 $("#register-email").removeClass('valid error');
                 $('.progress').css('display','none');
                }
            })
        }
    });
}

//-------------call validation function----------

validation();

});