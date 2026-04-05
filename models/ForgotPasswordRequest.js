const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: "forgot_password_requests"
});

module.exports = ForgotPasswordRequest;