import joi from '@hapi/joi';

class Validation {
  // validate for user signup
  static signupValidation(info) {
    const schema = {
      email: joi.string()
        .email()
        .trim()
        .lowercase()
        .required(),
      firstName: joi.string()
        .min(3)
        .required(),
      lastName: joi.string()
        .min(3)
        .required(),
      password: joi.string()
        .min(7)
        .max(30)
        .required(),
      address: joi.string()
        .min(10)
        .required(),
    };
    return joi.validate(info, schema);
  }

  static signinValidation(info) {
    const schema = {
      email: joi.string()
        .email()
        .trim()
        .lowercase()
        .required(),
      password: joi.string()
        .required(),
    };
    return joi.validate(info, schema);
  }

  static validateUserVerify(info) {
    const schema = {
      email: joi.string().email().required(),
      status: joi.string().valid('unverified', 'verified').required(),
    };
    return joi.validate(info, schema);
  }
}

module.exports = Validation;
