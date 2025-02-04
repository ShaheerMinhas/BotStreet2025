import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import pool from '../config/db';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// ✅ Nodemailer Configuration (BotStreet)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "switch.magazine1@gmail.com",
    pass: "mgspvndtbnybnfpe", // Gmail App Password
  },
});

// ✅ Function to Send OTP via Email
const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: 'switch.magazine1@gmail.com',
    to: email,
    subject: 'BotStreet - Email Verification OTP',
    text: `Your OTP for BotStreet registration is: ${otp}. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Error sending OTP');
  }
};

// ✅ Generate a 6-digit numeric OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ Register User (With OTP Verification)
export const registerUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password, otp } = req.body;

  if (!name || !email || !password || !otp) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check OTP
    const [otpRows]: any = await pool.execute(
      'SELECT otp, expires_at FROM otp_verifications WHERE email = ?',
      [email]
    );

    if (otpRows.length === 0 || otpRows[0].otp !== otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Check OTP Expiration
    if (new Date(otpRows[0].expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired. Request a new one.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert User
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    await pool.execute(query, [name, email, hashedPassword]);

    // Delete OTP after successful registration
    await pool.execute('DELETE FROM otp_verifications WHERE email = ?', [email]);

    // Generate JWT Token
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering user' });
  }
};

// ✅ Send OTP for Email Verification
export const sendOTP = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  try {
    // Check if email already exists
    const [userRows]: any = await pool.execute('SELECT email FROM users WHERE email = ?', [email]);
    if (userRows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // OTP expires in 5 minutes

    // Save OTP in Database
    await pool.execute('INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp=?, expires_at=?', 
      [email, otp, expiresAt, otp, expiresAt]);

    // Send OTP via Email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Error sending OTP' });
  }
};

// ✅ Verify OTP (Before Registration)
export const verifyOTP = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  try {
    const [otpRows]: any = await pool.execute('SELECT otp, expires_at FROM otp_verifications WHERE email = ?', [email]);

    if (otpRows.length === 0 || otpRows[0].otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check OTP Expiration
    if (new Date(otpRows[0].expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};

// ✅ User Login
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    console.log("Attempting to sign in...");

    const [rows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.userid, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error logging in' });
  }
};
