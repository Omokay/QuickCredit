import express from 'express';
import adminHandler from '../controllers/adminHandler';
import userHandler from '../controllers/userHandler';
import Auth from '../authentication/auth';

const router = express.Router();

// Make post requests to signup API Endpoints
router.post('/auth/signup', userHandler.signupHandler);
// Make post requests to signin API Endpoints
router.post('/auth/signin', userHandler.signinHandler);
// Make post request to verify user
router.patch('/users/:email/verify', Auth.adminAuthorize, userHandler.getVerified);
// Admin Get specific loan
router.get('/loans/:id', Auth.userAuthorize, adminHandler.getSpecificLoan);

/** This route will handle admin getting all loan and
 *  Admin getting current loans in the case where query params {status:approved & repaid:false}
 * (GET /loans?status=approved&repaid=false)
 *  Also repaid loans in the case where {status:approved & repaid:true} is passed as query params
 * (GET /loans?status=approved&repaid=true)
 */
router.get('/loans', Auth.adminAuthorize, adminHandler.getCurrentLoans);

// Get request to user repayment loan history
router.get('/loans/:id/repayments', Auth.userAuthorize, userHandler.getRepaymentLoans);

module.exports = router;
