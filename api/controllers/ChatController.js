/**
* ChatController
*
* @description :: Server-side logic for managing chats and messages
*/

module.exports = {

	connect: function(req, res) {

		if (!req.isSocket) {
			return res.badRequest("Received a non socket request.");
		}

		// Make client that connected join the public room
		sails.sockets.join(req, 'public');
		req.session.currentRoom = 'public';

		// Broadcast to other ALL other sockets in room
		sails.sockets.broadcast('public', 'newClientConnect', { username: req.session.username, userId: req.session.userId }, req);

		sails.log.debug("User '"+req.session.username+"' joined the chat.");

		// Return connect response
		return res.json({
			msg: '~ Connected to "Public". ~',
			type: 'notification'
		});
	},

	message: function(req, res) {

		if (!req.isSocket) {
			return res.badRequest("Received a non socket request.");
		}

		// Update message count of user
		User.addMessageCount(req.session.userId, function (err, response) {
			if (err) { return res.negotiate(err); }
			if (!response) { return res.serverError(new Error('Failed to get response from user update!')); }
		});

		// Prepare message data
		messageData = {
			msg: req.param('msg'),
			fromSocketId: sails.sockets.getId(req),
			username: req.session.username
		};

		// Broadcast to other ALL other sockets in room
		sails.sockets.broadcast('public', 'message', messageData, req);

		// Return success message
		return res.json({
			msg: 'Successfully send message!',
			type: 'confirmation'
		});
	}
};
