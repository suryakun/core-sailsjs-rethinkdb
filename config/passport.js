var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt,
bcrypt = require('bcryptjs'),
orm = require('thinky-loader');

/**
 * Configuration object for Local strategy
 */
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var User = orm.models.User;
  User.filter({ id: id }).run().then((result) => {
    done(null, result);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    var User = orm.models.User;
    User.filter({ username: username }).run().then((user) => {
      user = user[0];

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password, function (err, res) {
        if (!res)
          return done(null, false, {
            message: 'Invalid Password'
          });
        var returnUser = {
          name: user.name,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          id: user.id,
          roles: user.roles
        };
        return done(null, returnUser, {
          message: 'Logged In Successfully'
        });
      });

    });    
  }

));