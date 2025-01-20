import { Request, Response } from "express";
import pool from "../config/db"; // Assuming you have a DB connection set up

// Function to fetch articles from the database
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch articles from the database where status is 'published'
    const [rows] = await pool.query('SELECT * FROM articles ');
    res.status(200).json(rows); // Send the fetched articles as JSON response
  } catch (error) {
    console.error("Error Fetching Articles", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
};

// Function to publish an article
export const publishArticle = async (req: Request, res: Response): Promise<void> => {
  const { title, description, content, image, user_id } = req.body;

  try {
    // Validate required fields
    if (!title || !content) {
      res.status(400).json({ message: "Title, content, and user ID are required" });
      return;
    }

    // Explicitly set status to 'published'
    const articleStatus = 'published';

    // Insert the article into the database
    const [result]: any = await pool.query(
      `INSERT INTO articles (title, description, content, image, user_id, created_at, updated_at, status) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
      [title, description || "", content, image || "", user_id || 1, articleStatus] // Use articleStatus explicitly
    );

    res.status(201).json({
      message: "Article published successfully",
      articleId: result.insertId,
    });
  } catch (error) {
    console.error("Error Publishing Article", error);
    res.status(500).json({ message: "Failed to publish article" });
  }
};

