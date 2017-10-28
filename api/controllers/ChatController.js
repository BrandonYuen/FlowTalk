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

		// Broadcast to other ALL other sockets in room
		sails.sockets.broadcast('public', 'newClientConnect', { username: req.session.username }, req);

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

		// Prepare message data
		messageData = {
			msg: req.param('msg'),
			fromSocketId: sails.sockets.getId(req),
			username: req.session.username
		};

		sails.log.debug("Received message: ",messageData);

		// Broadcast to other ALL other sockets in room
		sails.sockets.broadcast('public', 'message', messageData, req);

		// Return success message
		return res.json({
			msg: 'Successfully send message!',
			type: 'confirmation'
		});
	}
};
