$(document).ready(function(){
	
	var online = $('#online-users');

	var listRef = new Firebase("https://bc12-drawtogether.firebaseio.com/users/");
	var userRef = listRef.push();

	// Add ourselves to presence list when online.
	var presenceRef = new Firebase("https://bc12-drawtogether.firebaseio.com/.info/connected");
	presenceRef.on("value", function(snap) {
		if (snap.val()) {
		userRef.set(true);
		// Remove ourselves when we disconnect.
		userRef.onDisconnect().remove();
		}
	});


	// Number of online users is the number of objects in the presence list.
	listRef.on("value", function(snap) {
	//console.log("# of online users = " + snap);
	var theHolder = {};
	var theVal = snap.val();
	online.html('');
	var url = 'http://soundbible.com/grab.php?id=2067&type=mp3';
	document.getElementById("online-users").innerHTML="<audio autoplay='true' src='../assets/audio/andoodle.mp3'>";
	for(var key in theVal){
		var users = theVal[key];
		if(users.username !== undefined){
			var username = users.username;
			var email = users.email;
			theHolder[email] = username;
			online.prepend('<div>' + theHolder[email] + '</div><br>');
		}
	}
	}); 



	//online.append('user.uid');
	//alert("hello world!");
});