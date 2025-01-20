import express from 'express';
import { registerUser, loginUser,verifyOTP,sendOTP } from '../controllers/signupController';

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp',verifyOTP);
router.post('/send-otp',sendOTP);
export default router;