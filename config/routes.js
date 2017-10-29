module.exports.routes = {

	// HTML Views
	'/': 'UserController.homePage',
	'/admin': 'AdminController.adminPage',
	'get /login': 'UserController.loginPage',
	'get /signup': { view: 'user/signup' },

	// Endpoints
	'post /login': 'UserController.login',
	'post /signup': 'UserController.signup',
	'/logout': 'UserController.logout',

	// ajax
	'post /admin/loadUsersForAdminPanel': 'AdminController.loadUsersForAdminPanel',
	'post /admin/adminToggle': 'AdminController.adminToggle',

	'post /changeName': 'UserController.changeName'
};
