import express from 'express';
import {handleSendOtp,handleRegisterUser,handleVerifyOtp,loginUser,fetchUser} from '../controllers/signupController';
const router = express.Router();


router.post('/register', handleRegisterUser);
router.post('/verify-otp',handleVerifyOtp);
router.post('/send-otp',handleSendOtp);
router.post('/login',loginUser);
router.post('/islogin',fetchUser);
export default router;