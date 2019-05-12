import users from '../models/userDataStructure';
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
      userDetails,
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
    const user = users.findIndex(useremail => useremail.email === email);

    if (user !== -1) {
      const checkPass = Authenticate.checkPassword(
        password,
        users[user].password,
      );
      if (checkPass) {
        return res.status(200)
          .json({
            message: 'You have logged in successfully',
            status: 200,
            data: users[user],
          });
      }
    }
    // In the case where inputs are incorrect
    return res.status(400)
      .json({
        status: 400,
        error: 'Incorrect email or password',
      });
  }

  // Mark a user as verified
  static getVerified(req, res) {
    // mark a user as verified or unverified
    const { error } = Validate.validateUserVerify(req.body);
    if (error) {
      res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    }
    const { email } = req.params;
    // Check if the index of such user exits
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex !== -1) {
      // If this is true, then the user with this index exists.
      const newUser = {
        id: users[userIndex].id,
        email: users[userIndex].email,
        firstName: users[userIndex].firstName,
        lastName: users[userIndex].lastName,
        address: users[userIndex].address,
        status: 'verified',
        isAdmin: users[userIndex].isAdmin,
      };
      return res.status(200).json({
        status: 200,
        data: newUser,
      });
    }
    return res.status(404).json({
      status: 404,
      error: 'User does not exist',
    });
  }
}


module.exports = userHandler;
