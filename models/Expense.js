const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const UserExpenses = sequelize.define("UserExpenses", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "CASCADE"
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: "user_expenses",
    timestamps: true,
    indexes: [
        {
            fields: ["userId"]
        }
    ]
});

module.exports = UserExpenses;