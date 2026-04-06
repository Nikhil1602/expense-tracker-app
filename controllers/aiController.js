const genAI = require("../utils/gemini");
const logger = require("../utils/logger");

exports.categorizeExpense = async (req, res) => {

    try {

        const { text } = req.body;

        const prompt = `
            Categorize this expense into one of these:
            Food, Transport, Entertainment, Other

            Only return one word.

            Expense: ${text}
        `;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let category = result.text.trim();

        // 🔥 Clean output
        category = category.replace(/[^a-zA-Z]/g, "");

        return res.json({ category });

    } catch (err) {

        logger.error("========================================>");
        logger.error(`ERROR WHILE CATEGORIZE EXPENSE THROUGH AI: ${err.stack || err.message}`);
        logger.error("========================================>");
        return res.status(500).json({ error: "AI failed" });

    }

};