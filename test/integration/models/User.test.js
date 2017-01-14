let orm = require('thinky-loader');
var thinky = require('thinky')();
var r = thinky.r;
var expect = require('chai').expect;

describe('UserModel', function() {

  describe('#save user and get the result has property name', function() {
    it('should check find function', function (done) {
      orm.models.User.save({name:'surya',email:'surya@surya.com'})
      .then((user) => {
        expect(user).to.have.property('name');
        done();
      })
      .catch(done)
    });
  });

});