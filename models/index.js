const Users = require("./User");
const UserExpenses = require("./Expense");
const ForgotPasswordRequest = require("./ForgotPasswordRequest");

// User model
Users.hasMany(UserExpenses, { foreignKey: "userId" });

// Expense model
UserExpenses.belongsTo(Users, { foreignKey: "userId" });

Users.hasMany(ForgotPasswordRequest, { foreignKey: "userId" });
ForgotPasswordRequest.belongsTo(Users, { foreignKey: "userId" });

module.exports = { Users, UserExpenses, ForgotPasswordRequest };