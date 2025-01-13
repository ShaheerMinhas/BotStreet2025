import express from "express";
import { getArticles } from "../controllers/articlesController";

const router = express.Router();

// Define the route to get published articles
router.get('/get-articles', getArticles);

export default router;
