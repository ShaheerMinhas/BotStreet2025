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

export const sendEssaySubmissionEmail = async (req: Request, res: Response) => {
  const htmlContent = `
    <div style="max-width:600px;margin:auto;padding:30px;font-family:'Segoe UI',sans-serif;background:#f0f4f8;border-radius:10px;border:1px solid #d0d7de">
      <h2 style="text-align:center;color:#0d47a1">📚 Essay Submission</h2>
      <p style="font-size:16px;text-align:center;color:#333">HEYYY 🙌</p>
      <p style="font-size:18px;text-align:center;color:#1b5e20;font-weight:600;">ESSAY WAS SUBMITTED</p>
      <p style="text-align:center;color:#555">Wooshhhhh! Check Out Cloudinary</p>
      <hr style="margin:30px 0;border:0;border-top:1px solid #ccc" />
      <p style="text-align:center;font-size:12px;color:#999;">&copy; 2025 Shaheer Co. All rights reserved.</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: ['l217404@lhr.nu.edu.pk', 'minhasshaheer0@gmail.com'],
    subject: 'Essay Submission Notification',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Essay submission email sent successfully' });
  } catch (error) {
    console.error('Error sending essay submission email:', error);
    res.status(500).json({ error: 'Failed to send essay submission email' });
  }
};

// ✅ Function to Send OTP via Email

const sendOTPEmail = async (email: string, otp: string) => {
  const htmlContent = `
    <div style="max-width:500px;margin:auto;padding:20px;font-family:'Segoe UI',sans-serif;background:#f8f8f8;border-radius:10px;border:1px solid #ddd">
      <h2 style="text-align:center;color:#4a148c">🔐 Email Verification Code</h2>
      <p style="text-align:center;font-size:16px">Hello 👋,</p>
      <p style="text-align:center;font-size:16px">Use the OTP below to verify your email address:</p>
      <div style="background:#ede7f6;color:#4a148c;font-size:24px;font-weight:bold;padding:15px;text-align:center;border-radius:8px;margin:20px 0">${otp}</div>
      <p style="text-align:center;color:#555">This code will expire in 5 minutes.</p>
      <p style="text-align:center;font-size:13px;color:#888;">If you didn't request this, you can safely ignore this email.</p>
      <hr />
      <p style="text-align:center;font-size:12px;color:#aaa">&copy; 2025 BotStreet</p>
    </div>
  `;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Registration',
    html: htmlContent,
  };
  await transporter.sendMail(mailOptions);
};

const generateOTP = (): string => {
  return crypto.randomBytes(3).toString('hex');
};

export const handleSendOtp = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  try {
    // Check if user already exists
    const [userRows]: any = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (userRows.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Insert or update OTP
    await pool.execute(
      `INSERT INTO otp_verification (email, otp, expires_at)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         otp = VALUES(otp),
         expires_at = VALUES(expires_at)`,
      [email, otp, expiresAt]
    );

    await sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Error sending OTP' });
  }
};


export const handleVerifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  console.log("Now trying to check good otp verify");
  const [storedOtp]: any = await pool.execute('SELECT otp FROM otp_verification WHERE email = ?', [email]);
  console.log(storedOtp,email,otp)
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
    await pool.execute('DELETE FROM otp_verification WHERE email = ?', [email]);

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
  console.log("Trying to confirm token and send back user details");

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) { 
      res.status(401).json({ error: 'No token provided' });
    }

    console.log("TOKEN RECEIVED FROM FRONTEND:", token);

    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
    const userId = decoded.id;

    console.log('FETCHING USER DETAILS FOR USER ID:', userId);

    const query = 'SELECT userid, name FROM users WHERE userid = ?';
    const [rows]: any = await pool.execute(query, [userId]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    console.log('User details:', user);

    res.status(200).json({ userId: user.userid, name: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};