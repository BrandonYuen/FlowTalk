/**
* AdminController
*
* @description :: Server-side logic for managing admin panel input from users (admins)
*/


module.exports = {


	/**
	* `AdminController.adminPage()`
	* @description :: Requests admin page data from model and gives it to view.
	*
	* @returns :: view
	*/
	adminPage: function (req, res) {
		// Get user data by id
		User.getUserById(req.session.userId, function (err, user) {
			if (err) { return res.negotiate(err); }
			if (!user) { return res.serverError(new Error('Could not find user in session!')); }

			limit = 10;

			//Get search word param if set, otherwise default to empty string
			searchWord = req.param('search') || "";
			adminFilter = req.param('adminFilter') || "false";
			adminFilter = (adminFilter == 'true'); // Convert to boolean
			sails.log.debug("searchWord = ",searchWord);
			sails.log.debug("adminFilter = ",adminFilter);

			//Get count of users and pages for pagination
			User.getCount(adminFilter, searchWord, limit, function (err, userCount, pageCount) {
				if (err) { return res.negotiate(err); }
				console.log("users found = ",userCount);

				return res.view('admin/panel', {
					searchWord: searchWord,
					adminFilter: adminFilter,
					user: user,
					pagination: {
						userCount: userCount,
						pageCount: pageCount
					}
				});
			});
		});
	},


	/**
	* `AdminController.loadUsersForAdminPanel()`
	* @description :: Ajax response to load users for admin panel
	*
	* @returns :: json
	*/
	loadUsersForAdminPanel: function (req, res) {
		// If not an AJAX request, redirect back to parent in url (i.e. /admin/loadUsersForAdminPanel -> /admin)
		if (!req.xhr) {
			return res.redirect('..');
		}

		//Get data parameters from request
		page = req.param('page');
		searchWord = req.param('searchWord');
		adminFilter = req.param('adminFilter') || "false";
		adminFilter = (adminFilter == 'true'); // Convert to boolean
		limit = 10; // NOTE: Make limit an configurable option?

		//Get count of users and pages for pagination
		User.getCount(adminFilter, searchWord, limit, function (err, userCount, pageCount) {
			if (err) { return res.negotiate(err); }

			//Get all users for the admin page (or a part of it using pagination / filters)
			User.getAllUsers(adminFilter, searchWord, page, limit, function (err, users) {
				if (err) { return res.negotiate(err); }
				if (!users) { return res.serverError(new Error('No users found!')); }

				return res.json({
					users: users,
					pagination: {
						userCount: userCount,
						pageCount: pageCount
					}
				});
			});
		});
	},


	/**
	* `AdminController.loadUsersForAdminPanel()`
	* @description :: Ajax response to load users for admin panel
	*
	* @returns :: json
	*/
	adminToggle: function (req, res) {
		// If not an AJAX request, redirect back to parent in url (i.e. /admin/loadUsersForAdminPanel -> /admin)
		if (!req.xhr) {
			return res.redirect('..');
		}

		//Get data parameters from request
		userId = req.param('userId');
		isAdmin = req.param('isAdmin');

		//Get all users for the admin page (or a part of it using pagination / filters)
		User.updateUserById(userId, {isAdmin: isAdmin}, function (err, response) {
			if (err) { return res.negotiate(err); }
			if (!response) { return res.serverError(new Error('Failed to get response from user update!')); }

			return res.json({
				response: response
			});
		});
	}

};
