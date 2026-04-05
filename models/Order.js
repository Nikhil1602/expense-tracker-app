const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Order = sequelize.define("order", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
        defaultValue: "PENDING"
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentId: {
        type: DataTypes.STRING
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: "orders",
    timestamps: true
});

module.exports = Order;