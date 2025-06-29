import express from 'express';
import {handleSendOtp,handleRegisterUser,handleVerifyOtp,loginUser,fetchUser,sendEssaySubmissionEmail} from '../controllers/signupController';
const router = express.Router();


router.post('/register', handleRegisterUser);
router.post('/verify-otp',handleVerifyOtp);
router.post('/send-otp',handleSendOtp);
router.post('/login',loginUser);
router.post('/islogin',fetchUser);
router.post('/essaySubmit',sendEssaySubmissionEmail)
export default router;