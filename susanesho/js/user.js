function registerUser (){
  this.register = function(email, password, username, showMessages) {
    var newMessage = showMessages; 
    var ref = new Firebase("https://bc12-drawtogether.firebaseio.com/")
    ref.createUser({
      email : email,
      password : password
    }, function(error, userData) {
      if (error) {
        switch (error.code) {
          case "EMAIL_TAKEN":
          newMessage.text("The new user account cannot be created because the specified email address is already in use.");
          break;
          case "INVALID_EMAIL":
          newMessage.text("The specified email is not a valid email.");
          break;
          default:
          newMessage.text ("Error creating user:" + error);
        }
      } else {
        newMessage.text ("Successfully created user account with uid:" + userData.uid);
        var usersReference = ref.child("users")
        var usersRef = usersReference.push();
        usersRef.set({
          email : email,
          password : password,
          username: username,
          uid : userData.uid
        });
      }
    });
  };

  this.login = function(email, password, showMessage ) {
    var message = showMessage;
    var ref = new Firebase("https://bc12-drawtogether.firebaseio.com/");
    ref.authWithPassword({
      email    : email,
      password : password
    }, function(error, authData) {
      if (error) {
        switch (error.code) {
          case "INVALID_EMAIL":
          message.text("The specified user account email is invalid.");
          case "INVALID_PASSWORD":
          message.text("The specified user account password is incorrect.");
          break;
          case "INVALID_USER":
          message.text("The specified user account does not exist.");
          case "INVALID_TOKEN":
          message.text("The specified authentication token is invalid. The token is either malformed or expired, kindly generate a new token");
          break;
          default:
          message.text("Error logging user in:" + error);
        }
      } else {
        message.text("Authenticated successfully with payload:" + authData);
      }
    }); 
  };

  this.forgotUserPassword = function(email,forgotStatement) {
    var forgotmessage = forgotStatement;
    var ref = new Firebase("https://bc12-drawtogether.firebaseio.com/");
    ref.resetPassword({
      email : email
    }, function(error) {
      if (error === null) {
        forgotmessage.text ("Password reset email sent successfully");
      } else {
        forgotmessage.text ("Error sending password reset email:" + error);
      }
    });
  };

  this.changeUserPassword = function(email,oldPassword,newPassword, usermessagepwd) {
    var changepwdmessage = usermessagepwd;
    var ref = new Firebase("https://bc12-drawtogether.firebaseio.com/");
    ref.changePassword({
      email       : email,
      oldPassword : oldPassword,
      newPassword : newPassword
    }, function(error) {
      if (error === null) {
        changepwdmessage.text ("Password changed successfully");
      } else {
        switch (error.code) {
          case "INVALID_EMAIL":
          changepwdmessage.text ("Please enter valid email.");
          break;
          case "INVALID_USER":
          changepwdmessage.text ("Specified user account does not exist. Please enter correct email address or Register to create account.");
          break;
          case "INVALID_TOKEN":
          changepwdmessage.text ("User token is invalid or expired.");
          break;
          default:
          changepwdmessage.text ("Error changing password, please kindly reset password and try again.");
        }
      }
    });
  };

  this.logout = function(email) {
    var ref = new Firebase("https://bc12-drawtogether.firebaseio.com/");
    ref.unauth();
  }
};

$(document).ready(function(){
  var message = $("#messagebox");
  var newMessage = $("#messagebox");
  var forgotmessage = $("#messagebox");
  var changepwdmessage = $("#messagebox");

  $("#signupsubmit").click(function(){
    var useremail = $("#signupemail").val();
    var userpassword = $("#signuppassword").val();
    var username = $("#username").val();
    var userRegistration = new registerUser();
    userRegistration.register(useremail, userpassword, username, newMessage);
  });

  $("#signinsubmit").click(function(){
    var useremail = $("#signinusername").val();
    var userpassword = $("#signinpassword").val();
    var userSignin = new registerUser();
    userSignin.login(useremail, userpassword, message);
  });

  $("#forgotPwd").click(function(){
    var forgotPwdEmail = $("#chngPwdEmail").val();
    var forgotpwd = new registerUser();
    forgotpwd.forgotUserPassword(forgotPwdEmail, forgotmessage);
  }); 

  $("#changePwd").click(function(){
    var changemail = $("#chngEmail").val();
    var oldPassword = $("#oldPwd").val();
    var newPassword = $("#newPwd").val();
    var changeUserPwd = new registerUser();
    changeUserPwd.changeUserPassword(changemail, oldPassword, newPassword, changepwdmessage);
  });

  $("#logout").click(function(){
    var logoutuser = new registerUser();
    alert (logoutuser.logout());
  });
});
  
             

         