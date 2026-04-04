const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Order = sequelize.define("order", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING"
    }
});

module.exports = Order;