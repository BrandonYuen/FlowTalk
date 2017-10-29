

//On pressing enter while typing in message input
$("#messageInput").on('keyup', function (e) {
    if (e.keyCode == 13) {
        sendButton();
    }
});

// Send button
function sendButton() {
	var msgContent = document.getElementById('messageInput').value;
	console.log("Sending message: ",msgContent);

	io.socket.post('/chat/message', { _csrf: _csrf, msg: msgContent }, function (resData, jwRes) {
		console.log("received response from server: ",jwRes);
		if (jwRes.statusCode != "200"){
			Materialize.toast('Failed to send message... ('+jwRes.body+') ', 4000)
			console.log("Error: ("+jwRes+"): ", resData);
		} else {
			var data = {
				username: username,
				msg: msgContent
			};
			showNewMessage("me", data);

			// Clear message input field
			document.getElementById('messageInput').value = "";
		}
	});
}

// On webpage load
$(document).ready(function() {

	// Connect to chat room (public 1)
	io.socket.get('/chat/connect', function gotResponse(data, jwRes) {
		console.log('Server responded with status code ' + jwRes.statusCode + ' and data: ', data);

		if (jwRes.statusCode != "200"){
			console.log("")
				Materialize.toast('Failed to connect to server... ('+jwRes.body+') ', 4000)
		} else {
			// Show user he connected
			showNewMessage("notification", {msg: '<b> ~ '+username+' joined the chatroom. ~</b>'});
			Materialize.toast('Connected to the chat room!', 2000)

			// Initialise listening sockets
			io.socket.on('message', function (data) {
				receivedMessage(data);
			});
			io.socket.on('newClientConnect', function (data) {
				newClientConnect(data);
			});
			io.socket.on('clientDisconnect', function (data) {
				clientDisconnect(data);
			});
		}
	});

})

// On receiving a message from a user
function receivedMessage(data) {
	console.log('Received:', data);
	showNewMessage("other", data)
}

// When a new user connects to the room
function newClientConnect(data) {
	showNewMessage("notification", {msg: '<b> ~ '+data.username+' joined the chatroom. ~</b>'});
	Materialize.toast(data.username+' joined the chatroom.', 2000);
	addUserToList(data);
}

// When a user disconnects the room
function clientDisconnect(data) {
	showNewMessage("notification", {msg: '<b> ~ '+data.username+' left the chatroom. ~</b>'});
	Materialize.toast(data.username+' left the chatroom.', 2000);
	removeUserFromList(data);
}

function addUserToList(data) {
	//If element for this user doesn't exist yet
	if ($('#userInList_'+data.userId).length == 0) {
		//Add user to userlist
		var userlist = document.getElementById('userlist');
		var newUser = document.createElement('span');
		newUser.className = "white-text";
	    newUser.setAttribute("id", "userInList_"+data.userId);
		newUser.innerHTML = ""+data.username+"<br/>";
		userlist.appendChild(newUser);
	}
}

function removeUserFromList(data) {
	//Remove user from userlist
	$('#userInList_'+data.userId).remove();
}


function showNewMessage(type, data) {
	var chat = document.getElementById('chatbox');

	switch (type) {
		case "me":
			chat.innerHTML = chat.innerHTML + '<p class="left-align" style="margin-right: 100px;"><b>'+data.username+'</b>: '+data.msg+'</p>';
			break;
		case "other":
			chat.innerHTML = chat.innerHTML + '<p class="right-align" style="margin-left: 100px;"><b>'+data.username+'</b>: '+data.msg+'</p>';
			break;
		case "notification":
			chat.innerHTML = chat.innerHTML + '<p class="center-align">'+data.msg+'</p>';
			break;
	}

	// Scroll down
	var chatContainer = document.getElementById('chatContainer');
	chatContainer.scrollTop = chatContainer.scrollHeight;
}



//Username change button
function updateNameButton() {
	var newName = document.getElementById('newName').value;

	 $.ajax({
		type: 'POST',
		url: "/changeName",
		data: {newName: newName, _csrf: _csrf},
		success: function(result) {
			if (result.response == "OK"){Materialize.toast('Your name has been updated!', 4000);}
			else {Materialize.toast(result.response, 4000);}
		}
	});
}
