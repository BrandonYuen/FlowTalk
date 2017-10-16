/**
* sessionAuth
*
* @module      :: Policy
* @description :: Simple policy to allow any authenticated user
*                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
* @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
*
*/
module.exports = function(req, res, next) {

	// User is allowed (admin), proceed to the next policy,
	// or if this is the last policy, the controller
	if (req.session.isAdmin == true) {
		return next();
	}

	// User is not permitted
	sails.log.debug("Not permitted (admin), redirecting to home.");
	return res.redirect('/');
};
