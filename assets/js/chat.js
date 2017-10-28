
// Send button
$('#sendButton').click(function (){
	var msgContent = document.getElementById('messageInput').value;
	console.log("Sending message: ",msgContent);

	io.socket.post('/chat/message', { _csrf: _csrf, msg: msgContent }, function (resData, jwRes) {
		console.log("received response from server: ",jwRes);
		if (jwRes.statusCode != 200) {
			console.log("Error ("+jwRes+"): ", resData);
		}
		var data = {
			username: username,
			msg: msgContent
		};
		showNewMessage("me", data);

	});
});

// On webpage load
$(document).ready(function() {

	// Connect to chat room (public 1)
	io.socket.get('/chat/connect', function gotResponse(data, jwRes) {
		console.log('Server responded with status code ' + jwRes.statusCode + ' and data: ', data);

		// Initialise listening sockets
		io.socket.on('message', function (data) {
			receivedMessage(data);
		});

		io.socket.on('newClientConnect', function (data) {
			newClientConnect(data);
		});
	});

})

// On receiving a message from a user
function receivedMessage(data) {
	console.log('Received:', data);
	showNewMessage("other", data)
}

// When a new user connects to the room
function newClientConnect(data) {
	showNewMessage("notification", data)
}

function showNewMessage(type, data) {
	var chat = document.getElementById('chatbox');

	switch (type) {
		case "me":
			chat.innerHTML = chat.innerHTML + '<p class="left-align"><b>'+data.username+'</b>: '+data.msg+'</p>';
			break;
		case "other":
			chat.innerHTML = chat.innerHTML + '<p class="right-align"><b>'+data.username+'</b>: '+data.msg+'</p>';
			break;
		case "notification":
			chat.innerHTML = chat.innerHTML + '<p class="center-align"><b> ~ '+data.username+' connect to the chatroom. ~</b></p>';
			break;
	}
}
