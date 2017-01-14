/*
    api/﻿hooks/thinkhook.js
	Thinky hook for loading all models
*/

module.exports = function(sails){

  return {

    connecting: function () {
      let orm = require('thinky-loader');
      let path = require('path');

      var dir = path.resolve(__dirname, '../models');

      let ormConfig = {
        debug     : true, 
        modelsPath: dir,
        thinky    : {
          rethinkdb: {
            host        : 'localhost',
            port        : 28015,
            authKey     : "",
            db          : "sails",
            timeoutError: 5000,
            buffer      : 5,
            max         : 1000,
            timeoutGb   : 60 * 60 * 1000
          }
        }
      };

      // returns a promise when configured
      orm.initialize(ormConfig) // you can also optionally pass an instance of thinky: [orm.initialize(ormConfig, thinky)] for additional configuration.
      .then(() => console.log('DB Ready!'))
      .catch((e) => console.log(e));// catch the error...
    },

    initialize: function (cb) {
    	this.connecting();

       sails.emit('hook:thinkhook:done');
       return cb();
    },
  }

}