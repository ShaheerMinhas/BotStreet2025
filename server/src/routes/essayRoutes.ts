import express, { Request, Response } from 'express';
import { saveEssayLog ,getEssayLogs} from '../controllers/essayController';

const router = express.Router();

// POST route to save email
router.post('/save-essay', saveEssayLog);
router.get('/get-essay',getEssayLogs)
export default router;
