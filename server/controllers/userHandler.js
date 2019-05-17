import users from '../models/userDataStructure';
import loans from '../models/loanStructure';
import repayments from '../models/repaymentStructure';
import Validate from '../middlewares/validation';
import Authenticate from '../authentication/auth';


class userHandler {
  static signupHandler(req, res) {
    const { error } = Validate.signupValidation(req.body);

    if (error) {
      return res.status(400)
        .json({
          status: 400,
          error: error.details[0].message,
        });
    }
    const {
      email,
      firstName,
      lastName,
      password,
      address,
    } = req.body;

    // check if new user email is already in use
    const createuser = users.find(user => user.email === email);
    if (createuser) {
      return res.status(409).json({
        status: 409,
        error: 'This email is already taken',
      });
    }

    // Initialise status and user type (client or admin) for new user
    const status = 'unverified';
    const isAdmin = false;
    const id = users.length + 1;

    // Generate token for new user
    const token = Authenticate.generateToken({
      id,
      email,
      status,
      isAdmin,
    });

    const userDetails = {
      token,
      id,
      email,
      firstName,
      lastName,
      password: Authenticate.hashPassword(password),
      address,
      status,
      isAdmin,
    };

    users.push(userDetails);

    return res.status(201).json({
      status: 201,
      data: {
        token,
        id,
        email,
        firstName,
        lastName,
        address,
        status,
        isAdmin,
      },
    });
  }

  static signinHandler(req, res) {
    const { email, password } = req.body;

    // validate inputs for user signin
    const { error } = Validate.signinValidation(req.body);
    if (error) {
      return res.status(400)
        .json({
          status: 400,
          error: error.details[0].message,
        });
    }

    // Check if email is in userStructure
    const user = users.find(useremail => useremail.email === email);
    if (user) {
      const {
        id,
        firstName,
        lastName,
        isAdmin,
      } = user;

      const checkPass = Authenticate.checkPassword(
        password,
        user.password,
      );
      if (checkPass) {
        const token = Authenticate.generateToken({
          id,
          email,
          isAdmin,
        });

        return res.status(200)
          .json({
            message: 'You have logged in successfully',
            status: 200,
            data: {
              token,
              id,
              email: user.email,
              firstName,
              lastName,
              isAdmin,
            },
          });
      }
    }
    return res.status(400)
      .json({
        status: 400,
        error: 'Incorrect email or password',
      });
  }

  // Apply for new loan
  static applyLoan(req, res) {
    const { email, amount, tenor } = req.body;

    const { error } = Validate.validateCreateLoan(req.body);
    if (error) {
      return res.status(400)
        .json({
          status: 400,
          error: error.details[0].message,
        });
    }
    // Check if user has an open loan already
    if (loans.find(loan => loan.user === email)) {
      return res.status(409)
        .json({
          status: 409,
          error: 'You cannot apply at this time',
        });
    }
    const loanId = loans.length + 1;
    const interest = 0.05 * amount;
    const paymentInstallment = (amount + interest) / tenor;
    const balance = amount - 0;

    const loanInfo = {
      id: loanId,
      user: email,
      createdOn: new Date(),
      status: 'pending',
      repaid: false,
      tenor,
      amount,
      paymentInstallment,
      balance,
      interest,
    };
    loans.push(loanInfo);

    return res.send({
      status: 201,
      data: loanInfo,
    });
  }

  // Mark a user as verified
  static getVerified(req, res) {
    // Mark a user as verified
    const { error } = Validate.validateUserVerify(req.params);
    if (error) {
      res.status(400).send({
        status: 400,
        error: error.details[0].message,
      });
    } else {
      const { email } = req.params;
      // Check if the index of such user exits
      const user = users.find(userEmail => userEmail.email === email);
      if (user) {
        user.status = 'verified';
        res.status(200)
          .json({
            status: 200,
            data: {
              token: user.token,
              id: user.id,
              email: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              address: user.address,
              status: user.status,
              isAdmin: user.isAdmin,
            },
          });
      } else {
        res.status(404)
          .json({
            status: 404,
            error: 'Email does not exist',
          });
      }
    }
  }

  // User get repayment loans
  static getRepaymentLoans(req, res) {
    const { id } = req.params;
    const { error } = Validate.validateId(req.params.id);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    }
    const repayment = repayments.find(repLoan => repLoan.loanId === parseInt(id, 10));
    if (repayment) {
      return res.status(200)
        .json({
          status: 200,
          data: repayment,
        });
    }
    return res.status(404)
      .json({
        status: 404,
        error: 'Repayment not found',
      });
  }
}


module.exports = userHandler;
