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
		}
	},

	validationMessages: {
		name: {
			required: 'Name is required.'
		},
		email: {
			required: 'Email is required',
			email: 'Invalid email',
			unique: 'Email already registered'
		},
		password: {
			required: 'Password is required'
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
			password: require('bcrypt-nodejs').hashSync(inputs.password)
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
				sails.log.debug("user: ", user);
				return cb (err, user);
			}
		});
	},



	/**
	* Retrieves all users
	*
	* @param  {integer}   userId
	*/

	getAllUsers: function (cb) {
		sails.log.debug("getAllUsers");

		User.find({})
		//.limit(20)
		.exec(function (err, users){
			if (err || !users) return cb (err);
			else{
				sails.log.debug("users: ", users);
				return cb (err, users);
			}
		});
	}
};
