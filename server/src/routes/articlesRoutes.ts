import express from "express";
import { getArticleById, publishArticle, getArticles ,updateArticle} from "../controllers/articlesController";

const router = express.Router();

// Route to get published articles
router.get('/get-articles', getArticles);

// Route to publish a new article
router.post('/publish', publishArticle);

router.get("/articles/:id", getArticleById);  // ✅ Ensure this exact path exists
router.post('/update/:id',updateArticle);

export default router;
