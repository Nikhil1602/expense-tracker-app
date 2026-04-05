const User = require("../models/User");

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

        res.json(users);

    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Failed" });

    }

};