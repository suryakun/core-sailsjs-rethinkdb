/**
 * User.js
 *
 * @description :: Example user model.
 */
﻿
 module.exports = function()
{
    let thinky = this.thinky;
    let validator = require('validator');
    let type   = this.thinky.type;
    let models = this.models;

    return {

	    tableName: "User", 
	    schema: {
	        id: type.string(),
	        name: type.string().required(),
	        password: type.string(),
	        roles: [type.string()],
	        email: type.string().validator(validator.isEmail),
	        createdAt: type.date().default(new Date())
	    },
	    options: {},

	    // set up any relationships, indexes or function definitions here
	    init: function(model) {
			
	    }
    };
};
