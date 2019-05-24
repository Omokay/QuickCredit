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
    };
    return joi.validate(info, schema);
  }

  static validateCreateLoan(info) {
    const schema = {
      email: joi.string()
        .email()
        .lowercase()
        .required(),
      tenor: joi.number()
        .min(1)
        .max(12)
        .required(),
      amount: joi.number()
        .min(10000)
        .max(1000000)
        .required(),
    };
    return joi.validate(info, schema);
  }

  static validateLoanApprovals(info) {
    const schema = {
      email: joi.string()
        .email()
        .required(),
      status: joi.string()
        .valid('approved', 'rejected')
        .required(),
    };
    return joi.validate(info, schema);
  }

  static validateId(info) {
    const schema = {
      loanId: joi.number()
        .required(),
    };
    return joi.validate(info, schema);
  }
}

module.exports = Validation;
