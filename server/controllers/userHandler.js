// import info from '../models/userDataStructure';
// import loans from '../models/loanStructure';
// import repayments from '../models/repaymentStructure';
import Validate from '../middlewares/validation';
import Authenticate from '../authentication/auth';
import info from '../models/migrations/userQueries';
import loans from '../models/migrations/loanQueries';
import repaymentData from '../models/migrations/repaymentQueries';


class userHandler {
  static async signupHandler(req, res) {
    const { error } = Validate.signupValidation(req.body);
    if (error) {
      return res.status(400)
        .json({
          status: 400,
          error: error.details[0].message,
        });
    }
    console.log(req.body);
    const getUser = await info.getUserByEmail(req.body.email);
    // check if new user email is already in use
    if (getUser.rowCount > 0) {
      return res.status(409).json({
        status: 409,
        error: 'This email is already taken',
      });
    }

    const userData = await info.createUser(req.body);

    if (!userData) {
      return res.status(500).json({
        error: 'Cannot process request',
      });
    }

    const user = userData.rows[0];
    const {
      id,
      firstname,
      lastname,
      email,
      address,
      status,
      isadmin,
    } = user;

    // Generate token for new user
    const token = Authenticate.generateToken({
      id: user.id,
      email,
      isadmin: userData.rows[0].isadmin,
    });

    return res
      .header('Authorization', token)
      .status(201).json({
        status: 201,
        data: {
          token,
          id,
          firstname,
          lastname,
          email,
          address,
          status,
          isadmin,
        },
      });
  }

  static async signinHandler(req, res) {
    const { error } = Validate.signinValidation(req.body);
    if (error) {
      return res.status(400)
        .json({
          status: 400,
          error: error.details[0].message,
        });
    }
    const { email, password } = req.body;
    const user = await info.getUserByEmail(email);
    // validate inputs for user signin

    // Check if email is belongs to a valid user
    if (user.rowCount === 0) {
      return res.status(404).json({
        error: 'Invalid email',
      });
    }

    const checkPass = Authenticate.checkPassword(
      password,
      user.rows[0].password,
    );

    if (!checkPass) {
      return res.status(400).json({
        error: 'Incorrect email or password',
      });
    }

    const {
      id,
      firstname,
      lastname,
      status,
      isadmin,
    } = user.rows[0];

    const token = Authenticate.generateToken({
      id,
      email,
      isadmin,
    });

    return res.status(200).json({
      data: {
        token,
        id,
        email,
        firstname,
        lastname,
        status,
        isadmin,
      },
    });
  }

  // Apply for new loan
  static async applyLoan(req, res) {
    const { error } = Validate.validateCreateLoan(req.body);
    if (error) {
      return res.status(400)
        .json({
          status: 400,
          error: error.details[0].message,
        });
    }
    const { tenor, amount } = req.body;
    const userLoan = await loans.getLoanByEmail(req.body.email);
    const userData = await info.getUserByEmail(req.body.email);
    if (userData.rows[0] < 1) {
      return res.status(404).send({
        error: 'User does not exist!',
      });
    }

    if (userData.rows[0].status !== 'verified') {
      return res.status(401).json({
        error: 'You need to be verified',
      });
    }
    
    if (!userLoan) {
      return res.status(500).json({
        error: 'Something went down',
      });
    }
    if (!userLoan.rows.length || userLoan.rows[userLoan.rows.length - 1].repaid) {
      const status = 'pending';
      const repaid = false;
      const interest = 0.05 * amount;
      const paymentInstallment = ((amount + interest) / tenor);
      const balance = paymentInstallment * tenor;
      const { email, firstName, lastName } = userLoan.rows[0];

      const loanData = {
        email,
        firstName,
        lastName,
        status,
        tenor,
        amount,
        balance,
        interest,
        paymentInstallment,
        repaid,
      };
      const response = await loans.applyLoan(loanData);
      const newLoan = response.rows[0];
      return res.status(201).json({
        data: {
          ...newLoan,
        },
      });
    }

    return res.status(409).json({
      error: 'Already applied for a loan',
    });
  }

  // Mark a user as verified
  static async getVerified(req, res) {
    const { error } = Validate.validateUserVerify(req.params);
    if (error) {
      res.status(400).send({
        status: 400,
        error: error.details[0].message,
      });
    }

    const { email } = req.params;
    // console.log(email);
    const user = await info.getUserByEmail(email);

    if (!user) {
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }
    if (user.rows[0].status === 'verified') {
      return res.status(409).json({
        error: 'This user already verified',
      });
    }
    if (!user.rows[0]) {
      res.status(404)
        .json({
          status: 404,
          error: 'Email does not exist',
        });
    }

    await info.userVerify(email);

    const verifiedUser = await info.getUserByEmail(email);
    const {
      firstname, lastname, address, status,
    } = verifiedUser.rows[0];

    const data = {
      firstname,
      lastname,
      email: verifiedUser[0].email,
      address,
      status,
    };
    return res.status(200)
      .json({
        status: 200,
        message: 'User has been verified',
        data,
      });
  }

  // User get repayment loans
  static async getRepaymentLoans(req, res) {
    const { id } = parseInt(req.params, 10);
    const { error } = Validate.validateId(id);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    }
    const repayment = await repaymentData.getRepaymentById(id);

    // if (req.user !== userEmail.rows[0].email) {
    //   return res.status(401).json({
    //     error: 'Email do not match! Enter the email you registered with',
    //   });
    // }
    if (repayment.rowCount === 0) {
      return res.status(404).json({
        error: 'You have no repayment history',
      });
    }
    if (repayment.rows.length !== 0) {
      return res.status(200)
        .json({
          status: 200,
          data: repayment.rows,
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
