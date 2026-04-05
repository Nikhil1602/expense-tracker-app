require('dotenv').config();

const express = require('express');
const cors = require("cors");
const sequelize = require("./utils/db");
const expenseRoutes = require("./routes/expenseRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const premiumRoutes = require("./routes/premiumRoutes");

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

app.use((req, res) => {
    res.status(404).send("Page not found");
});

sequelize.sync({ alter: true, force: true }).then(() => {
    console.log("DB synced");
    app.listen(process.env.PORT, () => console.log("Server running"));
});