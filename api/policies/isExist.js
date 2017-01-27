/*
middle ware is user exist
*/

var orm = require("thinky-loader");

module.exports = function (req, res, next) {
	orm.models.User.filter({email: req.body.email}).run()
		.then((users) => {
			if (users.length > 0 ) {
				res.badRequest("user already exist");	
			} else {
				next();
			}
		})
		.catch((err) => {
			console.log(err)
		})

}