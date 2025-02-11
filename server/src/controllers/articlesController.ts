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
  const { title, description, content, image, userId, author_name, author_linkedin, article_images } = req.body;

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
      `INSERT INTO articles (title, description, content, image, user_id, created_at, updated_at, status,author_name, author_linkedin) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?)`,
      [title, description || "", content, image || "", userId || 1, articleStatus,author_name, author_linkedin] // Use articleStatus explicitly
    );

    const articleId = result.insertId;
    if (article_images.length > 0) {
      const imageInsertPromises = article_images.map(async (imgUrl) => {
        await pool.query(
          `INSERT INTO images (article_id, image_url) VALUES (?, ?)`,
          [articleId, imgUrl]
        );
      });
      await Promise.all(imageInsertPromises);
    }

    res.status(201).json({
      message: "Article published successfully",
      articleId: result.insertId,
    });
  } catch (error) {
    console.error("Error Publishing Article", error);
    res.status(500).json({ message: "Failed to publish article" });
  }
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.query("SELECT * FROM articles WHERE id = ?", [id]);

    if (rows.length === 0) {
      res.status(404).json({ message: "Article not found" });  // ✅ Check if this is causing 404
      return;
    }

    // Fetch article images
    const [images]: any = await pool.query("SELECT image_url FROM images WHERE article_id = ?", [id]);
    rows[0].article_images = images.map((img: any) => img.image_url);

    res.status(200).json(rows[0]);  // ✅ Sends article data if found
  } catch (error) {
    console.error("Error Fetching Article", error);
    res.status(500).json({ message: "Failed to fetch article" });
  }
};

// Function to update an article
export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, content, image, article_images, author_name, author_linkedin } = req.body;

  try {
    // Check if the article exists
    const [existingArticle]: any = await pool.query("SELECT * FROM articles WHERE id = ?", [id]);
    if (existingArticle.length === 0) {
      res.status(404).json({ message: "Article not found" });
      return;
    }

    // Update the article fields, including author name and LinkedIn
    await pool.query(
      `UPDATE articles 
       SET title = ?, description = ?, content = ?, image = ?, author_name = ?, author_linkedin = ?, updated_at = NOW() 
       WHERE id = ?`,
      [title, description, content, image, author_name, author_linkedin, id]
    );

    // Remove old images and insert new ones if provided
    if (article_images && article_images.length > 0) {
      await pool.query("DELETE FROM images WHERE article_id = ?", [id]);
      const imageInsertPromises = article_images.map(async (imgUrl) => {
        await pool.query("INSERT INTO images (article_id, image_url) VALUES (?, ?)", [id, imgUrl]);
      });
      await Promise.all(imageInsertPromises);
    }

    res.status(200).json({ message: "Article updated successfully" });
  } catch (error) {
    console.error("Error Updating Article", error);
    res.status(500).json({ message: "Failed to update article" });
  }
};
