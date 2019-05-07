import joi from '@hapi/joi';


class Validation {
// validate for user login
  static signinValidation(info) {
    const schema = {
      email: joi.string()
        .email()
        .trim()
        .lowercase()
        .required(),
      password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    };
    return joi.validate(info, schema);
  }
}

module.exports = Validation;
