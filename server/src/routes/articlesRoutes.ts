import express from "express";
import { getArticles, publishArticle } from "../controllers/articlesController";

const router = express.Router();

// Route to get published articles
router.get('/get-articles', getArticles);

// Route to publish a new article
router.post('/publish', publishArticle);

export default router;
