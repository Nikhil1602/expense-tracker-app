require('dotenv').config();

const express = require('express');
const cors = require("cors");
const sequelize = require("./utils/db");
const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const aiRoutes = require("./routes/aiRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const logger = require('./utils/logger');

require("./models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("view"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/view/expense-tracker.html");
});

app.use("/api/expense", expenseRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res) => {
    res.status(404).send("Page not found");
});

// sequelize.sync({ alter: true }).then(() => {
//     console.log("DB synced");
//     app.listen(process.env.PORT, () => console.log("Server running"));
// });

process.on("unhandledRejection", (err) => {
    console.error("🔥 Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err);
});

(async () => {

    try {

        await sequelize.sync({ alter: true });

        logger.info("✅ Database synced");

        app.listen(process.env.PORT, () => {
            logger.info(`🚀 Server running on port ${process.env.PORT}`);
        });

    } catch (err) {

        logger.error("========================================>");
        logger.error(`ERROR WHILE SYNCING DB: ${err.stack || err.message}`);
        logger.error("========================================>");
        process.exit(1);

    }

})();