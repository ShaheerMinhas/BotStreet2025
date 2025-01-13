import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import pool from '../config/db';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from'dotenv';
const SECRET_KEY = 'your_secret_key';

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use any email service you prefer
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS,  // Your email password
  },
});

// Function to send OTP via email
const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your OTP for Registration',
    text: `Your OTP for registration is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Error sending OTP');
  }
};

// Register a new user// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password, organization, otp } = req.body;
  
    if (!name || !email || !password || !organization ) {
      console.log(email, password, organization);
      return res.status(400).json({ error: 'All fields are required' });
    }
  
 
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO users (name,email, password, organization_id) VALUES (?, ?, ?, ?)';
      await pool.execute(query, [name, email, hashedPassword, organization]);
  
      // Delete OTP after successful registration
      await pool.execute('DELETE FROM otp_verifications WHERE email = ?', [email]);
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error registering user' });
    }
  };
  
// Function to generate OTP
const generateOTP = (): string => {
  return crypto.randomBytes(3).toString('hex'); // Generates a 6-digit OTP
};

// Send OTP for email verification
export const sendOTP = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  // Check if the email already exists in the system
  const [userRows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (userRows.length > 0) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const otp = generateOTP();

  try {
    // Save the OTP to the database for verification
    const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    await pool.execute('INSERT INTO otp_verifications (email, otp ,expires_at) VALUES (?, ?,?)', [email, otp,expiresAt]);

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Error sending OTP' });
  }
};

// OTP verification route (for testing, can be expanded)
export const verifyOTP = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  try {
    const [storedOtp]: any = await pool.execute('SELECT otp FROM otp_verifications WHERE email = ?', [email]);

    if (storedOtp.length === 0 || storedOtp[0].otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};

export const loginUser = async (req: Request, res: Response) : Promise<any> => {
    const { email, password } = req.body;

    try { 
        console.log("Hi Trying to sign in");
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows]: any = await pool.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error logging in' });
    }
};