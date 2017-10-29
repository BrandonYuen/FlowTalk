/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name: {
			type: 'string',
			required: true,
			unique: false
		},
		email: {
			type: 'email',
			required: true,
			unique: true
		},
		password: {
			type: 'string',
			required: true
		},
		isAdmin: {
			type: 'boolean',
			defaultsTo: false
		},
		lastLogin: {
			type: 'datetime'
		},
		totalMessages: {
			type: 'integer',
			defaultsTo: 0
		}
	},

	validationMessages: {
		name: {
			required: 'No name specified.'
		},
		email: {
			required: 'No email specified.',
			email: 'Invalid email.',
			unique: 'Email already registered.'
		},
		password: {
			required: 'No password specified.'
		}
	},


	/**
	* Create a new user using the provided inputs,
	* but encrypt the password first.
	*
	* @param  {Object}   inputs
	*                     • name     {String}
	*                     • email    {String}
	*                     • password {String}
	* @param  {Function} cb
	*/

	signup: function (inputs, cb) {

		// Create a user
		User.create({
			name: inputs.name,
			email: inputs.email,
			password: require('bcrypt-nodejs').hashSync(inputs.password),
			lastLogin: new Date()
		})
		.exec(cb);
	},



	/**
	* Check validness of a login using the provided inputs.
	* But encrypt the password first.
	*
	* @param  {Object}   	inputs
	*                     	• email    {String}
	*                     	• password {String}
	* @param  {Function} 	cb
	*/

	attemptLogin: function (inputs, cb) {

		// Find a user
		User.findOne({
			email: inputs.email
		})
		.exec(function (err, record){
			//If error
			if (err || !record) return cb (err);

			//If password is matching
			if (require('bcrypt-nodejs').compareSync(inputs.password, record.password)){

				//Update lastlogin for user
				User.update({id:record.id},{lastLogin:new Date()}).exec(function (err, updated){
					if (err) {sails.log.error(err);}
				});

				return cb (err, record);

			//If password is not matching, return error without user record
			}else{
				return cb (err);
			}
		});
	},



	/**
	* Retrieves all the data of a single user.
	*
	* @param  {integer}   	userId
	* @param  {Function} 	cb
	*/

	getUserById: function (userId, cb) {

		// Find a user
		User.findOne({
			id: userId
		})
		.exec(function (err, user){
			if (err || !user) return cb (err);
			else{
				return cb (err, user);
			}
		});
	},



	/**
	* Retrieves all users, based on page and max users per page (limit)
	*
	* @param  {integer}   	page
	* @param  {integer}   	limit
	* @param  {Function} 	cb
	*/

	getAllUsers: function (adminFilter, searchWord, page, limit, cb) {
		sails.log.debug("User.getAllUsers > searchWord: ",searchWord, "page: ",page, "limit: ", limit);

		User.find({
			or : [
				{ name: { contains: searchWord }, isAdmin: adminFilter },
				{ email: { contains: searchWord }, isAdmin: adminFilter }
			]
		})
		.paginate({page: page, limit: limit})
		.exec(function (err, users){
			if (err || !users) return cb (err);
			else{
				return cb (err, users);
			}
		});
	},



	/**
	* Returns count of users and count of pages based on limit
	*
	* @param  {integer}   	limit
	* @param  {Function} 	cb
	*/

	getCount: function (adminFilter, searchWord, limit, cb) {

		User.count({
			or : [
				{ name: { contains: searchWord }, isAdmin: adminFilter },
				{ email: { contains: searchWord }, isAdmin: adminFilter }
			]
		})
		.exec(function (err, amount){
			if (err) return cb (err);
			if (!amount) return cb (err, 0);
			else{
				// Calculate amount of pages based on limit (recordsPerPage)
				pages = Math.ceil(amount / limit);
				if (pages < 1){pages = 1};
				return cb (err, amount, pages);
			}
		});
	},



	/**
	* Retrieves all users, based on page and max users per page (limit)
	*
	* @param  {integer}   	page
	* @param  {integer}   	limit
	* @param  {Function} 	cb
	*/

	updateUserById: function (userId, params, cb) {

		//Update lastlogin for user
		User.update({id:userId},params).exec(function (err, updatedRecords){
			if (err) {
				sails.log.error(err);
				return cb(err);
			}

			sails.log.debug("User.updateUserById > Updated user (",userId,"):", updatedRecords[0]);

			return cb(err, "OK");
		});
	},

	addMessageCount: function (userId, cb) {

		User.findOne({
			id: userId
		})
		.exec(function (err, user) {
			if (err) {
				sails.log.error(err);
				return cb(err);
			}
			if (!user) sails.log.error('Could not find user.');

			user.totalMessages += 1;
			user.save(function (err) {
				if (err) {
					sails.log.error(err);
					return cb(err);
				}
				sails.log.debug("User.addMessageCount > Updated user "+user.id+" with totalMessages = "+user.totalMessages);
				return cb(err, "OK");
			});
		});

	}
};
