
io.socket.on('newClientConnect', function (data) {
	console.log('Socket `' + data.id + '` joined the party!');
});


$('#sendButton').click(function (){
	var msgContent = $('#messageInput').value;

	io.socket.post('/chat/message', { msg: msgContent }, function (resData, jwRes) {

	});
});

//On webpage load
$(document).ready(function() {

	// Connect to chat room (public 1)
	io.socket.get('/chat/connect', function gotResponse(data, jwRes) {
		console.log('Server responded with status code ' + jwRes.statusCode + ' and data: ', data);

		io.socket.on('message', function (data) {
			console.log('Received message: `' + data.msg + '`.');
		});
	});

})
