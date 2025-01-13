import { Request, Response } from "express";
import pool from "../config/db"; // Assuming you have a DB connection set up

// Function to fetch articles from the database
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch articles from the database where status is 'published'
    const [rows] = await pool.query('SELECT * FROM articles WHERE status = ?', ['published']);
    res.status(200).json(rows); // Send the fetched articles as JSON response
  } catch (error) {
    console.error("Error Fetching Articles", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};
