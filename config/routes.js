module.exports.routes = {

	// HTML Views
	'/': 'UserController.homePage',
	'/admin': 'UserController.adminPage',
	'get /login': 'UserController.loginPage',
	'get /signup': { view: 'user/signup' },

	// Endpoints
	'post /login': 'UserController.login',
	'post /signup': 'UserController.signup',
	'/logout': 'UserController.logout',
};
