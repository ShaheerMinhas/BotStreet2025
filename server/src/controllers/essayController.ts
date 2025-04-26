import { Request, Response } from 'express';
import pool from '../config/db';  // Adjust the path to your actual db config file

export const saveEssayLog = async (req: Request, res: Response): Promise<any> => {
  const { essaylog } = req.body;

  // Ensure that the essaylog is provided
  if (!essaylog) {
    return res.status(400).json({ error: 'Essay log is required' });
  }

  try {
    // Prepare the SQL query to insert the essaylog into the database
    const query = 'INSERT INTO essay (logessay) VALUES (?)';
    
    // Execute the query
    const [result] = await pool.execute(query, [essaylog]);

    // Send a success response
    res.status(200).json({ message: 'Essay log saved successfully', result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save essay log' });
  }
};


export const getEssayLogs = async (req: Request, res: Response): Promise<any> => {
    try {
      // SQL query to fetch all essay logs from the database
      const query = 'SELECT * FROM essay';
      
      // Execute the query
      const [rows] = await pool.execute(query);
  
      // If there are no essays in the database
      if (Array.isArray(rows) && rows.length === 0) {
        return res.status(404).json({ message: 'No essays found' });
      }
  
      // Send a success response with the fetched essay logs
      res.status(200).json({ message: 'Essay logs retrieved successfully', essays: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve essay logs' });
    }
  };