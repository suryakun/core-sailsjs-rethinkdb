/**
 * isAdmin
 * @description :: Policy to check user is admin
 */
 
module.exports = function (req, res, next) {
    var roles = req.user.roles;
    if (!roles || roles.indexOf('admin') < 0 ) {
		res.serverError("You dont have authorization for this action");
	} else {
		next();
	}
};