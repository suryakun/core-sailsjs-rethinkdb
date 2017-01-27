const Orm = require("thinky-loader");
const bcrypt = require('bcryptjs');

class Auth {

	hash (model, next) {
		let salt = bcrypt.genSaltSync();
        bcrypt.hash(model.password, salt, function(err, hash) {
            if (err) {
                next(err, null);
            } else {
            	model.password = hash;
                next(null, model);
            }
        });
	}

	hookUpdate (password, next) {
		let salt = bcrypt.genSaltSync();
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                next(hash);
            }
        });
	}

	profiling(obj) {
	    delete obj.password;
	    delete obj.provider;
	    return obj;
	}

	login(req, res, next, params, cb) {
		var passport = require('passport');
		passport.authenticate('local', cb)(req, res, next);
	}

	encrypt(data, next) {
		return new Buffer(data).toString('base64');
	}

	decrypt(data, next) {
		return new Buffer(data, 'base64').toString('ascii');
	}


}

module.exports = new Auth();