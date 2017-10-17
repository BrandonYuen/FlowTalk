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
		isActive: {
			type: 'boolean',
			defaultsTo: true
		},
		lastLogin: {
			type: 'datetime'
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
		sails.log.debug("creating user");
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
	* @param  {Object}   inputs
	*                     • email    {String}
	*                     • password {String}
	* @param  {Function} cb
	*/

	attemptLogin: function (inputs, cb) {
		sails.log.debug("trying user");

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
					if (err) {return res.serverError(err);}

					sails.log.debug("Updated user ("+record.name+") lastLogin to: ",updated[0].lastLogin);
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
	* @param  {integer}   userId
	*/

	getUserById: function (userId, cb) {
		sails.log.debug("getUserById: "+userId);

		// Find a user
		User.findOne({
			id: userId
		})
		.exec(function (err, user){
			if (err || !user) return cb (err);
			else{
				sails.log.debug("name: ", user.name);
				return cb (err, user);
			}
		});
	},



	/**
	* Retrieves all users
	*
	* @param  {integer}   userId
	*/

	getAllUsers: function (page, limit, cb) {
		sails.log.debug("getAllUsers, page: ",page, "limit: ", limit);

		User.find({})
		.paginate(page, limit)
		.exec(function (err, users){
			if (err || !users) return cb (err);
			else{
				return cb (err, users);
			}
		});
	}
};
