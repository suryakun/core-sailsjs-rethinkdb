/**
 * AuthController
 * @description :: Server-side logic for manage user's authorization
 */
var passport = require('passport');
var orm = require('thinky-loader')
/**
 * Triggers when user authenticates via passport
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} error Error object
 * @param {Object} user User profile
 * @param {Object} info Info if some error occurs
 * @private
 */
function _onPassportAuth(req, res, error, user, info) {
  if (error) return res.serverError(error);
  if (!user) return res.badRequest('User or Password Invalid');
 
  return res.ok({
    // TODO: replace with new type of cipher service
    token: TokenService.createToken(user),
    user: user
  });
}

/**
 * Triggers when user authenticates via twitter
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} error Error object
 * @param {Object} user User profile
 * @param {Object} info Info if some error occurs
 * @private

function _onTwitterAuth(req, res, error, user, info) {
  if (error) return res.serverError(error);
  if (!user) return res.forbidden();
  delete user.twitterData;
  var parameter = JSON.stringify({
    token: TokenService.createToken(user),
    user: user
  });
  return res.view('callback', {param: parameter});
}
 */

/**
 * Triggers when user authenticates via facebook
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} error Error object
 * @param {Object} user User profile
 * @param {Object} info Info if some error occurs
 * @private
function _onFacebookAuth(req, res, error, user, info) {
  if (error) return res.serverError(error);
  if (!user) return res.forbidden();
  delete user.facebookData;
  var parameter = JSON.stringify({
    token: TokenService.createToken(user),
    user: user
  });
  return res.view('callback', {param: parameter});
}
 */

/**
 * Triggers when user authenticates via google
 * @param {Object} req Request object
 * @param {Object} res Response object
 * @param {Object} error Error object
 * @param {Object} user User profile
 * @param {Object} info Info if some error occurs
 * @private
function _onGoogleAuth(req, res, error, user, info) {
  if (error) return res.serverError(error);
  if (!user) return res.forbidden();
  delete user.googleData;
  var parameter = JSON.stringify({
    token: TokenService.createToken(user),
    user: user
  });
  return res.view('callback', {param: parameter});
}
 */
 
module.exports = {
  /**
   * Sign up in system
   * @param {Object} req Request object
   * @param {Object} res Response object
   */
  signup: function (req, res) {

    AuthService.hash(req.body, (err, model) => {
      orm.models.User.save([model]).then((doc) => {
        res.created({
          token: TokenService.createToken(doc[0]),
          user: AuthService.profiling(doc[0])
        });
      })
      .catch((err) => {
        res.serverError(err);
      })
    })

  },
 
  /**
   * Sign in by local strategy in passport
   * @param {Object} req Request object
   * @param {Object} res Response object
   */
  signin: function (req, res) {
    passport.authenticate('local', 
      _onPassportAuth.bind(this, req, res))(req, res);
  },
  
  /**
   * Sign in by facebook strategy in passport
   * @param {Object} req Request object
   * @param {Object} res Response object
  auth_facebook: function (req, res, next) {
    passport.authenticate('facebook')(req, res, next);
  },
   */

  /**
   * Sign in by twitter strategy in passport
   * @param {Object} req Request object
   * @param {Object} res Response object
  auth_twitter: function (req, res, next) {
    passport.authenticate('twitter')(req, res, next);
  },
   */

  /**
   * Sign in by twitter strategy in passport
   * @param {Object} req Request object
   * @param {Object} res Response object
  auth_google: function (req, res, next) {
    passport.authenticate('google', { scope: ['profile'] })(req, res, next);
  },
   */

  /**
   * Callback for facebook strategy in passport
   * @param {Object} req Request object
   * @param {Object} res Response object
  callback_facebook: function (req, res) {
    passport.authenticate('facebook', 
      _onFacebookAuth.bind(this, req, res))(req, res);
  },
   */

  /**
   * Callback for twitter strategy in passport
   * @param {Object} req Request object
   * @param {Object} res Response object
  callback_twitter: function (req, res) {
    passport.authenticate('twitter', 
      _onTwitterAuth.bind(this, req, res))(req, res);
  },
   */

  /**
   * Callback for twitter strategy in passport
   * @param {Object} req Request object
   * @param {Object} res Response object
  callback_google: function (req, res) {
    passport.authenticate('google',
      _onGoogleAuth.bind(this, req, res))(req, res);
  },
   */

  /**
   * Callback for forgot password
   * @param {Object} req Request object
   * @param {Object} res Response object
  forgot_password: function (req, res) {
    var email = req.body.email;
    console.log(req.body);
    orm.models.User.filter({email: email})
    .then(function (users) {
      console.log(users);
      if (users.length == 0) {
        res.badRequest('Email not found')
      } else {
        let user = users[0];
        let date = new Date();
        // expired 1 hari
        let string = user.id + " " + (date.getTime() + 86400000);
        // console.log(string);
        let hash = AuthService.encrypt(string)
        req.session.token = hash;
        EmailService.send(sails.config.baseUri + '/#!/?token=' + encodeURIComponent(hash) + '&action=resetpass', req.body.email );
        res.ok('An instruction has sent to your e-mail');
      }
    })
  },
   */

  /**
   * Confirm new password
   * @param {Object} req Request object
   * @param {Object} res Response object
  confirm_password: function (req, res) {
    let token = req.session.token;
    if (req.body.newpassword != req.body.confpassword) res.badRequest('Password not match');
    if (req.body.token) {
      let decrypt = AuthService.decrypt(req.body.token);
      let id = decrypt.split(" ")[0];

      orm.models.User.get(id).run()
      .then((user) => {
          AuthService.hookUpdate(req.body.newpassword, (hash) => {
            orm.models.User.get(id).update({password: hash})
            .then((userobj) => {
              res.created({
                token: TokenService.createToken(userobj),
                user: AuthService.profiling(userobj)
              });
            }, () => {
              res.badRequest('Update password failed');
            });
          });
      })
      .catch((err) => {
        res.badRequest('Token invalid');
      }); 

    } else {
      res.badRequest('Token not found');
    }
  }
   */

};