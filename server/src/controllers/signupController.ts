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
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Registration',
    text: `Your OTP for registration is: ${otp}`,
  };
  await transporter.sendMail(mailOptions);
};

const generateOTP = (): string => {
  return crypto.randomBytes(3).toString('hex');
};

export const handleSendOtp = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  const [userRows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (userRows.length > 0) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const otp = generateOTP();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);

  await pool.execute('INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expiresAt]);
  await sendOTPEmail(email, otp);

  res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });
};

export const handleVerifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  console.log("Now trying to check good otp verify");
  const [storedOtp]: any = await pool.execute('SELECT otp FROM otp_verifications WHERE email = ?', [email]);

  if (storedOtp.length === 0 || storedOtp[0].otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  return res.status(200).json({ message: 'OTP verified successfully' });
};

export const handleRegisterUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body;
  console.log("Now trying to register after good otp verify");
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    await pool.execute('DELETE FROM otp_verifications WHERE email = ?', [email]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering user' });
  }
};
