require('dotenv').config();

const { Sequelize } = require('sequelize');

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;
const DB = process.env.DB;

const sequelize = new Sequelize(DB, USER, PASSWORD, {
    host: HOST,
    dialect: "mysql"
});

(async () => {

    try {

        await sequelize.authenticate();
        console.log("Connection established...");

    } catch (err) {

        console.log(err);

    }

})();

module.exports = sequelize;