module.exports.routes = {

	// HTML Views
	'/': 'UserController.homePage',
	'get /login': { view: 'user/login' },
	'get /signup': { view: 'user/signup' },

	// Endpoints
	'post /login': 'UserController.login',
	'post /signup': 'UserController.signup',
	'/logout': 'UserController.logout',
};
