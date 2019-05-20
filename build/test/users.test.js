"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _app = _interopRequireDefault(require("../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var secretKey = process.env.secretKey;
var email = 'chuku.omoke@gmail.com';
var verifiedRoutes = "/api/v1/users/".concat(email, "/verify");

_chai["default"].should();

_chai["default"].use(_chaiHttp["default"]); // Unit test for requests made to API Endpoints for signin


describe('Signin Test', function () {
  describe('POST Request to /api/v1/auth/signin', function () {
    it('Should sign registered user in', function (done) {
      var user = {
        email: 'chuku.omoke@gmail.com',
        password: 'password'
      };

      _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').send(user).end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
    });
    it('Should not login user when email is not registered', function (done) {
      var user = {
        email: 'omoke.chuku@gmail.com',
        password: 'helpmeoo'
      };

      _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
    });
    it('Should not login user when password is incorrect', function (done) {
      var user = {
        email: 'chuk.omoke@gmail.com',
        password: 'passsss'
      };

      _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
    });
    it('Should return 400  if Email field is omitted', function (done) {
      var user = {
        password: 'omokedavid'
      };

      _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
    });
    it('Should return 400  if Password field is omitted', function (done) {
      var user = {
        email: 'chuku.omoke@gmail.com'
      };

      _chai["default"].request(_app["default"]).post('/api/v1/auth/signin').send(user).end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        done();
      });
    });
  });
}); // Unit test for requests made to Api Endpoint for signup

describe('Signup Test', function () {
  describe('POST Request to /api/v1/auth/signup', function () {
    it('should be able to signup valid users', function (done) {
      var user = {
        email: 'chalu.philips@gmail.com',
        firstName: 'Chalu',
        lastName: 'Philips',
        password: 'chaluphilips',
        address: 'Epic tower online'
      };

      _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
        res.should.have.status(201);
        res.should.be.an('object'); // res.body.should.have.property('status').eql(201);

        res.body.should.have.property('data');
        done();
      });
    });
    describe('POST to signup', function () {
      it('should throw a 409 error if the email is already taken', function (done) {
        var user = {
          email: 'chuku.omoke@gmail.com',
          firstName: 'Omoke',
          lastName: 'Chuku',
          password: 'pijkjkhk',
          address: 'Epic Tower Nigeria'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw a 400 error if firstName is not a string', function (done) {
        var user = {
          email: 'omoke.david@gmail.com',
          firstName: 234,
          lastName: 'david',
          password: 'davidomoke',
          address: 'I live somewhere sha'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw a 400 error if lastName is not a string', function (done) {
        var user = {
          email: 'omoke.david@gmail.com',
          firstName: 'david',
          lastName: 456,
          password: 'omokdavo',
          address: 'My address is my address'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw a 400 error if email is not inputed', function (done) {
        var user = {
          firstName: 'Ogachalu',
          lastName: 'Ogaphilips',
          password: 'chalu234',
          address: 'Epic Tower Rwanda'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw a 400 error if firstName is not inputed', function (done) {
        var user = {
          email: 'ogachalu.philips@gmail.com',
          lastName: 'Ogaphilips',
          password: 'chalu234',
          address: 'Epic Tower Kigali'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw a 400 error if lastName is not inputed', function (done) {
        var user = {
          email: 'ogachalu.philips2@gmail.com',
          firstName: 'Ogachal',
          password: 'chalu234',
          address: 'Epic Tower Oshodi'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw a 400 error if password is not inputed', function (done) {
        var user = {
          email: 'wejem@gmail.com',
          firstName: 'Emmanuel',
          lastName: 'Weje',
          address: 'Kolex bustop yaba'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw a 400 error if address is not inputed', function (done) {
        var user = {
          email: 'ikechuku.samuel@gmail.com',
          firstName: 'Ikechuku',
          lastName: 'Samuel',
          password: 'iksamuel'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw a 400 error if the firstName is less than 3 alphabets', function (done) {
        var user = {
          email: 'hello@world.com',
          firstName: 'he',
          lastName: 'world',
          password: 'hdididdh',
          address: 'I live in the world'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw a 400 error if the lastName is less than 3 alphabets', function (done) {
        var user = {
          email: 'hello22@world.com',
          firstName: 'hello',
          lastName: 'wo',
          password: 'jdhddsls',
          address: 'I live in your repo sometimes'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw an error if the password is less than 7 characters', function (done) {
        var user = {
          email: 'helpmeo@idontire.com',
          firstName: 'butcode',
          lastName: 'sweettowrite',
          password: 'hdhd',
          address: 'Ojuelegba lagos island'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
      it('should throw an error if address is less than 10 characters', function (done) {
        var user = {
          email: 'okay@finally.com',
          firstName: 'lastone',
          lastName: 'ipromise',
          password: 'jdjdjdjd',
          address: 'oshodi'
        };

        _chai["default"].request(_app["default"]).post('/api/v1/auth/signup').send(user).end(function (err, res) {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
        });
      });
    });
  });
}); // Unit test for requests made to Enpoint for marking user as verified

describe('Marking a user as verified', function () {
  var credentials = {
    email: 'omoke@admin.com',
    password: 'password'
  };

  var token = _jsonwebtoken["default"].sign(credentials, secretKey, {
    expiresIn: '8min'
  }); // it('Should allow admin to successfully verify a user', (done) => {
  //   chai.request(app)
  //     .patch(verifiedRoutes)
  //     .set('Authorization', token)
  //     .send(credentials)
  //     .end((err, res) => {
  //       res.should.have.status(201);
  //       res.body.should.be.a('object');
  //       res.body.should.have.property('data');
  //       done();
  //     });
  // });


  it('Should not verify a user when the email provided is not an admin', function (done) {
    _chai["default"].request(_app["default"]).patch(verifiedRoutes).set('Authorization', token).send({
      email: 'omoke@admin.com',
      password: 'password'
    }).end(function (err, res) {
      res.should.have.status(401);
      res.should.be.an('object');
      res.body.should.have.property('status');
      res.body.should.have.property('error');
      done();
    });
  });
  it('Should not verify a user with invalid inputs', function (done) {
    _chai["default"].request(_app["default"]).patch(verifiedRoutes).set('Authorization', token).send({
      email: 'helloeld',
      password: 'ed'
    }).end(function (err, res) {
      res.should.have.status(401);
      res.should.be.an('object');
      res.body.should.have.property('error');
      done();
    });
  });
});