import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import config from 'config';

class Authenticate {
  static checkPassword(inputPassword, savedPassword) {
    return bcryptjs.compareSync(inputPassword, savedPassword);
  }

  static generateToken(payload) {
    return jsonwebtoken.sign({ payload }, config.get('jwtPrivateKey'), { expires: '10d' });
  }

  static verifyToken(token) {
    return jsonwebtoken.verify(token, process.env.SECRETKEY);
  }
}


module.exports = Authenticate;
