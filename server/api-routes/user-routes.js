import express from 'express';
import userHandler from '../controllers/userHandler';
import Auth from '../authentication/auth';

const router = express.Router();

// Make post requests to signup API Endpoints
router.post('/auth/signup', userHandler.signupHandler);
// Make post requests to signin API Endpoints
router.post('/auth/signin', userHandler.signinHandler);
// Make post request to verify user
router.patch('/users/:user-email/verify', Auth.userAuthorize, userHandler.getVerified);


module.exports = router;
