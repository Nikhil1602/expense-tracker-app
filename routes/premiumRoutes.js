const router = require("express").Router();
const premiumController = require("../controllers/premiumController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.get("/leaderboard", premiumController.getLeaderboard);

module.exports = router;