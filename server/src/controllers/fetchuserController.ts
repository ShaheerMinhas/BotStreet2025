import { Request, Response } from 'express';
import pool from '../config/db';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

export const fetchUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) { 
      res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
    const userId = decoded.id;

    const query = 'SELECT name FROM users WHERE id = ?';
    const [rows]: any = await pool.execute(query, [userId]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    res.status(200).json({ name: user.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};
