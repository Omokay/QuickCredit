import users from '../models/userDataStructure';
import Validate from '../middlewares/validation';
import Authenticate from '../authentication/auth';


const signinHandler = (req, res) => {
  // validate inputs for user signin
  const { error } = Validate.signinValidation(req.body);
  if (error) {
    return res.status(400)
      .json({
        status: 400,
        error: error.details[0].message,
      });
  }

  const { email, password } = req.body;

  // Check if email is in userStructure
  const user = users.findIndex(useremail => useremail.email === email);

  if (user !== -1) {
    const checkPassword = Authenticate
      .checkPassword(
        user.password,
        password,
      );
    if (checkPassword) {
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
};


module.exports = signinHandler;
