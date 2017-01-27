var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy,
TwitterStrategy = require('passport-twitter').Strategy,
GoogleStrategy =  require('passport-google-oauth20').Strategy,
orm = require('thinky-loader');

var keys = {
   'facebook' : 
        {'client_id' : '637245516455050',
        'client_secret' : '38a0a39cf7c855da71c8ca6a5b5f874f',
    	'callback' : 'http://staging.kreasitv.com:1337/auth/facebook/callback'}
    ,
    'twitter' : 
        {'client_id' : 'E9H5iMcKIasfGC9cyOQA6KCjU',
        'client_secret' : 'UzAbChVNk9Wg3uGmuy8o3pRoThSea8R40jBHjrSwfT6OryPb1S',
    	'callback' : 'http://staging.kreasitv.com:1337/auth/twitter/callback'}
    ,
    'google' : 
        {'client_id' : '1080817739142-mmtogkbd95dcejegqser29i6de6ufhnm.apps.googleusercontent.com',
        'client_secret' : 'P5A-zoj2ws5AWVguXgaeNVK8',
      'callback' : 'http://staging.kreasitv.com:1337/auth/google/callback'}
    ,
}

passport.use(new TwitterStrategy({
    consumerKey: keys.twitter.client_id,
    consumerSecret: keys.twitter.client_secret,
    callbackURL: keys.twitter.callback
  },
  function(token, tokenSecret, profile, cb) {
    var User = orm.models.User;
  	User.filter({ twitterId: profile.id })
  	.then(function (user) {
  		if (user.length > 0) {
  			return cb(null, user[0])
  		} else {
  			User.save({ 
          twitterId: profile.id,
          name: profile.displayName,
          twitterData: profile
        })
  			.then(function (user) {
  				return cb(null, user)
  			})
  		}
  	})
  	.catch(function (err) {
  		return cb(err, null);
  	})
  }
));

passport.use(new FacebookStrategy({
    clientID: keys.facebook.client_id,
    clientSecret: keys.facebook.client_secret,
    callbackURL: keys.facebook.callback
  },
  function(accessToken, refreshToken, profile, cb) {
    var User = orm.models.User;
    User.filter({ facebookId: profile.id })
  	.then(function (user) {
  		if (user.length > 0) {
  			return cb(null, user[0])
  		} else {
  			User.save({ 
          facebookId: profile.id,
          name: profile.displayName,
          facebookData: profile
        })
        .then(function (user) {
          return cb(null, user)
        });
  		}
  	})
  	.catch(function (err) {
  		return cb(err, null);
  	})
  }
));

passport.use(new GoogleStrategy({
    clientID: keys.google.client_id,
    clientSecret: keys.google.client_secret,
    callbackURL: keys.google.callback
  },
  function(token, tokenSecret, profile, cb) {
    var User = orm.models.User;
    User.filter({ googleId: profile.id })
    .then(function (user) {
      if (user.length > 0) {
        return cb(null, user[0])
      } else {
        User.save({ 
          name: profile.displayName,
          googleId : profile.id,
          googleData : profile
        })
        .then(function (user) {
          return cb(null, user)
        })
      }
    })
    .catch(function (err) {
      return cb(err, null);
    })
  }
));