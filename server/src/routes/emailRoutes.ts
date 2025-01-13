import express, { Request, Response } from 'express';
import { saveEmail } from '../controllers/emailController';

const router = express.Router();

// POST route to save email
router.post('/save-email', saveEmail);

export default router;
