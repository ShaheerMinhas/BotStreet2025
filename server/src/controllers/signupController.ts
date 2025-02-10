import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import pool from '../config/db';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import crypto from 'crypto';
dotenv.config();

const SECRET_KEY =  'your_secret_key';

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

      const token = jwt.sign({ id: user.userid, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error logging in' });
  }
};

export const fetchUser = async (req: Request, res: Response): Promise<void> => {

  console.log("Trying to confirm token and send back username");
  try {
    console.log("Trying to confirm token and send back username");
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) { 
      res.status(401).json({ error: 'No token provided' });
    }
    console.log("TOKEN RECIEVED FROM FRONT IS ", token)
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
    const userId = decoded.id;
    console.log('FETCHING USERNAME FOR USER Id : ',userId);
    const query = 'SELECT name FROM users WHERE userid = ?';
    const [rows]: any = await pool.execute(query, [userId]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    console.log(user.name);
    res.status(200).json({ name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};