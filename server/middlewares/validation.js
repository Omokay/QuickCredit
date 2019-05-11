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
        .min(2)
        .required(),
      lastName: joi.string()
        .min(2)
        .required(),
      password: joi.string()
        .regex(/^[a-zA-Z0-9]{6,30}$/)
        .required(),
      address: joi.string()
        .min(10)
        .required(),
    };
    return joi.validate(info, schema);
  }

  // validate for user login
  static signinValidation(info) {
    const schema = {
      email: joi.string()
        .email()
        .trim()
        .lowercase()
        .required(),
      password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    };
    return joi.validate(info, schema);
  }
}

module.exports = Validation;
