import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import config from 'config';

class Authenticate {
  static checkPassword(inputPassword, savedPassword) {
    return bcryptjs.compareSync(inputPassword, savedPassword);
  }

  static generateToken(payload) {
    return jsonwebtoken.sign({ payload }, config.get('jwtPrivateKey'));
  }

  static verifyToken(token) {
    return jsonwebtoken.verify(token, config.get('jwtPrivateKey'));
  }

  static hashPassword(password) {
    return bcryptjs.hashSync(password, 10);
  }

  static adminAuthorize(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      req.user = Authenticate.verifyToken(token);
      if (req.user.payload.email !== 'omoke@admin.com') {
        return res.status(401)
          .json({
            status: 403,
            error: 'Unauthorized access',
          });
      }
      return next();
    } catch {
      return res.status(401)
        .json({
          status: 401,
          error: 'Invalid token!',
        });
    }
  }

  static userAuthorize(req, res, next) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = Authenticate.verifyToken(token);
      const userEmail = decoded.payload.email;
      if (userEmail.endsWith('gmail.com')) {
        return res.status(403)
          .json({
            status: 403,
            error: 'Unauthorized access',
          });
      }
      return next();
    } catch (error) {
      return res.status(401)
        .json({
          status: 401,
          error: 'Invalid token',
        });
    }
  }
}


module.exports = Authenticate;
