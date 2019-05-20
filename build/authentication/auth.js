"use strict";

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var secretKey = process.env.secretKey;

var Authenticate =
/*#__PURE__*/
function () {
  function Authenticate() {
    _classCallCheck(this, Authenticate);
  }

  _createClass(Authenticate, null, [{
    key: "checkPassword",
    value: function checkPassword(inputPassword, savedPassword) {
      return _bcryptjs["default"].compareSync(inputPassword, savedPassword);
    }
  }, {
    key: "generateToken",
    value: function generateToken(payload) {
      return _jsonwebtoken["default"].sign({
        payload: payload
      }, secretKey, {
        expiresIn: '24d'
      });
    }
  }, {
    key: "verifyToken",
    value: function verifyToken(token) {
      return _jsonwebtoken["default"].verify(token, secretKey, {
        expiresIn: '24d'
      });
    }
  }, {
    key: "hashPassword",
    value: function hashPassword(password) {
      return _bcryptjs["default"].hashSync(password, 10);
    }
  }, {
    key: "adminAuthorize",
    value: function adminAuthorize(req, res, next) {
      try {
        var token = req.headers.authorization.split(' ')[1];
        req.user = Authenticate.verifyToken(token);

        if (req.user.payload.email !== 'omoke@admin.com') {
          return res.status(401).json({
            status: 403,
            error: 'Unauthorized access'
          });
        }

        return next();
      } catch (_unused) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid token!'
        });
      }
    }
  }, {
    key: "userAuthorize",
    value: function userAuthorize(req, res, next) {
      try {
        var token = req.headers.authorization.split(' ')[1];
        var decoded = Authenticate.verifyToken(token);
        req.user = decoded.payload;

        if (!req.user.id) {
          return res.status(403).json({
            status: 403,
            error: 'Unauthorized access'
          });
        }

        return next();
      } catch (error) {
        return res.status(401).json({
          status: 401,
          error: 'Invalid token'
        });
      }
    }
  }]);

  return Authenticate;
}();

module.exports = Authenticate;