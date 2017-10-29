/**
* UserController
*
* @description :: Server-side logic for managing users
*/

module.exports = {

	/**
	* `UserController.loginPage()`
	*/
	loginPage: function (req, res) {
		if (req.session.authenticated) {
			return res.redirect('/');
		}
		return res.view('user/login');
	},

	/**
	* `UserController.homepage()`
	*/
	homePage: function (req, res) {
		// Get user data by id
		User.getUserById(req.session.userId, function (err, user) {
		    if (err) { return res.negotiate(err); }
		    if (!user) { return res.serverError(new Error('Could not find user in session!')); }

			return res.view('user/home', {
				user: user
			});
		});
	},

	/**
	* `UserController.login()`
	*/
	login: function (req, res) {

		// See `api/responses/login.js`
		return res.login({
			email: req.param('email'),
			password: req.param('password'),
			successRedirect: '/',
			invalidRedirect: '/login'
		});
	},


	/**
	* `UserController.logout()`
	*/
	logout: function (req, res) {

		// "Forget" the user from the session.
		// Subsequent requests from this user agent will NOT have `req.session.me`.
		req.session.authenticated = null;

		// If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
		// send a simple response letting the user agent know they were logged out
		// successfully.
		if (req.wantsJSON) {
			return res.ok('Logged out successfully!');
		}

		// Otherwise if this is an HTML-wanting browser, do a redirect.
		return res.redirect('/');
	},


	/**
	* `UserController.signup()`
	*/
	signup: function (req, res) {

		// Attempt to signup a user using the provided parameters
		User.signup({
			name: req.param('name'),
			email: req.param('email'),
			password: req.param('password')
		}, function (err, user) {

			if (err){
				for (var key in err.Errors){
				    for (var i=0; i < err.Errors[key].length; i++) {
						sails.log.debug(err.Errors[key][i].message);
					}
				}

				if (err.Errors){
					return res.view('user/signup', {
						validationErrors: err.Errors
					});
				}
				return res.negotiate(err);
			}

			sails.log.debug("UserController.signup > Created new user:", user);

			// Go ahead and log this user in as well.
			// We do this by "remembering" the user in the session.
			// Subsequent requests from this user agent will have `req.session.me` set.
			req.session.authenticated = true;
			req.session.userId = user.id;
			req.session.isAdmin = user.isAdmin;
			req.session.lastLogin = user.lastLogin;
			req.session.username = user.name;

			// If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
			// send a 200 response letting the user agent know the signup was successful.
			if (req.wantsJSON) {
				return res.ok('Signup successful!');
			}

			// Otherwise if this is an HTML-wanting browser, redirect to /welcome.
			return res.redirect('/');
		});
	},


	/**
	* `UserController.changeName()`
	* @description :: Ajax response to change a user's name
	*
	* @returns :: json
	*/
	changeName: function (req, res) {
		// If not an AJAX request, redirect back to parent in url (i.e. /admin/loadUsersForAdminPanel -> /admin)
		if (!req.xhr) {
			return res.redirect('..');
		}

		// Get data parameters from request
		userId = req.session.userId
		newName = req.param('newName');

		// Get user
		User.getUserById(userId, function(err, user) {
		    if (err) { return res.negotiate(err); }
		    if (!user) { return res.serverError(new Error('Could not find user in session!')); }

			// Check if user has the required amount totalMessages
			if (user.totalMessages < 10) {
				return res.json({
					response: "Error: Not enough total messages (10)."
				});
			}

			// Update user with new parameters, new name in this case
			User.updateUserById(userId, {name: newName}, function (err, response) {
				if (err) { return res.negotiate(err); }
				if (!response) { return res.serverError(new Error('Failed to get response from user update!')); }

				return res.json({
					response: response
				});
			});
		});
	}
};
