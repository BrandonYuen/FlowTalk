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
		sails.sockets.broadcast('public', 'newClientConnect', { id: req.socket.id }, req);

		// Return connect response
		return res.json({
			msg: '~ Connected to "Public". ~',
			type: 'notification'
		});
	}
};
