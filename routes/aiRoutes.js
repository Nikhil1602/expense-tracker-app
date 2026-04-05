const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const aiController = require("../controllers/aiController");

router.use(authMiddleware);
router.post("/categorize", aiController.categorizeExpense);

module.exports = router;