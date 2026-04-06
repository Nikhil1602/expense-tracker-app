const User = require("../models/User");
const logger = require("../utils/logger");

exports.getLeaderboard = async (req, res) => {

    try {

        const user = await User.findByPk(req.user.userId);

        if (!user || !user.isPremium) {
            return res.status(403).json({ error: "Not allowed" });
        }

        const users = await User.findAll({
            attributes: ["name", "totalExpense"],
            order: [["totalExpense", "DESC"]]
        });

        return res.json(users);

    } catch (err) {

        logger.error("========================================>");
        logger.error(`ERROR WHILE GETTING LEADERBOARD: ${err.stack || err.message}`);
        logger.error("========================================>");
        return res.status(500).json({ error: "Failed" });

    }

};