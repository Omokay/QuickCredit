import express from 'express';
import userHandler from '../controllers/userHandler';


const router = express.Router();

// Make post requests to signin API Endpoints
router.post('/auth/signin', userHandler);


module.exports = router;
