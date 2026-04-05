const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Users = sequelize.define("Users", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    totalExpense: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    resetToken: {
        type: DataTypes.STRING
    },
    resetTokenExpiry: {
        type: DataTypes.DATE
    }

}, {
    tableName: "users",
    timestamps: true,
});

module.exports = Users;