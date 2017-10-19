
module.exports = function(sails) {
	return {
		routes: {
			before: {
				// Register a "before" shadow route to handle redirects
				'all /*': function(req, res, next){
					if (req.url.substr(-1) === '/' && req.url.length > 1) {
						return res.status(301).redirect(req.url.slice(0, -1));
					}
					return next();
				}
			}
		}
	};
};
