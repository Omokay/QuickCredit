"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _userRoutes = _interopRequireDefault(require("./api-routes/user-routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])(); // allows access to body of the request

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
})); // use User routes

app.use('/api/v1', _userRoutes["default"]); // base route

app.get('/', function (req, res) {
  return res.status(200).send({
    status: 200,
    message: 'Welcome to Quick Credit'
  });
}); // all non-existent routes

app.all('*', function (req, res) {
  return res.status(404).send({
    status: 404,
    error: 'Page not found'
  });
});
app.listen(process.env.PORT || 4000, function () {
  console.log('now listening on port 4000');
});
module.exports = app;