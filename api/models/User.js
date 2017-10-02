/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
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
		}
	},

	validationMessages: {
		password: {
			required: 'Password is required'
		},

		email: {
			required: 'Email is required',
			email: 'Invalid email',
			unique: 'Email already registered'
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
		}).exec(function (err, record){
			//If error
			if (err) return cb (err);
			//If no record found with that email, return error
			if (!record) return cb (err);

			//If password is matching
			if (require('bcrypt-nodejs').compareSync(inputs.password, record.password)){
				return cb (err, record);
			//If password is not matching, return error without user record
			}else{
				return cb (err);
			}
		});
	}
};
