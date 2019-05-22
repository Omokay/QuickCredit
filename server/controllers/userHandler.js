import users from '../models/userDataStructure';
import loans from '../models/loanStructure';
import repayments from '../models/repaymentStructure';
import Validate from '../middlewares/validation';
import Authenticate from '../authentication/auth';
import db from '../models/migrations/dbConnect';
import Query from '../models/queries';


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
      address,
    } = req.body;

    // check if new user email is already in use
    const createuser = db.query(Query.userQuery, [email]);

    console.log(createuser, 'CREATE USR HERE >>>>>>.....');
    if (createuser.rowCount > 0) {
      return res.status(409).json({
        status: 409,
        error: 'This email is already taken',
      });
    }

    const password = Authenticate.hashPassword(req.body.password);
    const inputs = [firstName, lastName, email, password, address];

    const userDetails = db.query(createuser, inputs);
    const user = userDetails.rows[0];

    // Generate token for new user
    const token = Authenticate.generateToken({
      id: user.id,
      email,
      isAdmin: user.isAdmin,
    });

    return res
      .header('Authorization', token)
      .status(201).json({
        status: 201,
        data: [user],
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
    const user = db.query(Query.userQuery, [email]);
    if (user.rowCount > 0) {
      const userAccount = user.rows[0];
      const checkPass = Authenticate.checkPassword(
        password,
        userAccount.password,
      );

      if (checkPass) {
        const token = Authenticate.generateToken({
          id: userAccount.id,
          email,
          isAdmin: userAccount.isAdmin,
        });

        return res
          .header('Authorization', token)
          .status(200)
          .json({
            message: 'You have logged in successfully',
            status: 200,
            data: {
              token,
              id: userAccount.id,
              email: userAccount.email,
              firstName: userAccount.firstName,
              lastName: userAccount.lastName,
              status: userAccount.status,
              isAdmin: userAccount.isAdmin,
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
    const user = db.query(Query.userEmail, [email]);
    if (user.rowCount > 0) {
      return res.status(409)
        .json({
          status: 409,
          error: 'You cannot apply at this time',
        });
    }
    const interest = 0.05 * amount;
    const paymentInstallment = (amount + interest) / tenor;
    const balance = amount - 0;

    const loanInfo = {

    };
    loans.push(loanInfo);

    return res.send({
      status: 201,
      data: {
        id: user.rows[0].id,
        user: email,
        createdOn: new Date(),
        tenor,
        amount,
        paymentInstallment,
        balance,
        interest,
      },
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
