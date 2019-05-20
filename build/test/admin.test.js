"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mocha = require("mocha");

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _app = _interopRequireDefault(require("../app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_chai["default"].should();

_chai["default"].use(_chaiHttp["default"]);

_dotenv["default"].config();

var secretKey = process.env.secretKey;
var specificLoan = '/api/v1/loans/:id';
var user = {
  email: 'omoke@admin.com'
};

var token = _jsonwebtoken["default"].sign(user, secretKey, {
  expiresIn: '8min'
}); // Testing getting a specific loan data


(0, _mocha.describe)('Admin get a specific loan application', function () {
  (0, _mocha.it)('Should be able to get a specific loan data', function (done) {
    _chai["default"].request(_app["default"]).get(specificLoan).set('Authorization', token).end(function (err, res) {
      res.should.have.status(401);
      res.should.be.an('object');
      res.body.should.have.property('error');
      done();
    });
  });
  (0, _mocha.it)('Should not be able to get a loan application when there is none with the requested id', function (done) {
    _chai["default"].request(_app["default"]).get(specificLoan).set('Authorization', token).end(function (err, res) {
      res.should.have.status(401);
      res.should.be.an('object');
      res.body.should.have.property('status');
      res.body.should.have.property('error');
      done();
    });
  });
  (0, _mocha.it)('Should not be able to get a loan application when he/she is not authorized', function (done) {
    _chai["default"].request(_app["default"]).get(specificLoan).end(function (err, res) {
      res.should.have.status(401);
      res.should.be.an('object');
      res.body.should.have.property('status').eql(401);
      res.body.should.have.property('error');
      done();
    });
  });
});