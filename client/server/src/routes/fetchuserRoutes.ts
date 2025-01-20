const express = require("express");
const { fetchUser } = require("../controllers/fetchuserController");
//const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Route to fetch user details
router.get('/fetch-user', fetchUser);
export default router;
