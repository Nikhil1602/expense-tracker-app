const genAI = require("../utils/gemini");

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

        res.json({ category });

    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "AI failed" });

    }

};