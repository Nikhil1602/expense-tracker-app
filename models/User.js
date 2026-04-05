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
    }

}, {
    tableName: "users",
    timestamps: true,
});

module.exports = Users;