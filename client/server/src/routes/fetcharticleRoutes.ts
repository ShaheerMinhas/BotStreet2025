import express from "express";
import { getArticleById } from "../controllers/fetcharticleidController";

const router = express.Router();

// Route to fetch a single article by ID
router.get("/getarticles/:id", getArticleById);

export default router;
