import { Request, Response } from "express";
import pool from "../config/db"; // Assuming you have a DB connection set up

// Function to fetch a single article by ID from the database
export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Fetch article by ID from the database
    const [rows]: any = await pool.query(
      `SELECT * FROM articles WHERE id = ? AND status = ?`, 
      [id, 'published'] // Use the correct value for 'published'
    );
    
    if (rows.length > 0) {
      // Send the fetched article as a JSON response
      res.status(200).json(rows[0]);
    } else {
      // Send an error if no article found with the provided ID
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    console.error("Error Fetching Article", error);
    res.status(500).json({ message: "Failed to fetch article" });
  }
};
