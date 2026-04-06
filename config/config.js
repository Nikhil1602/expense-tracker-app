require("dotenv").config();

module.exports = {
    development: {
        username: process.env.USER || "root",
        password: process.env.PASSWORD || "your_password",
        database: process.env.DB || "expense_tracker",
        host: process.env.HOST || "127.0.0.1",
        dialect: "mysql"
    }
};