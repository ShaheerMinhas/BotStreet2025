import { Request, Response } from 'express';
import pool from '../config/db';

export const saveEmail = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const query = 'INSERT INTO emails (email) VALUES (?)';
    const [result] = await pool.execute(query, [email]);

    res.status(200).json({ message: 'Email saved successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save email' });
  }
};
