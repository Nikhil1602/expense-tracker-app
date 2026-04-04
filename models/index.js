const Users = require("./User");
const UserExpenses = require("./Expense");

// User model
Users.hasMany(UserExpenses, { foreignKey: "userId" });

// Expense model
UserExpenses.belongsTo(Users, { foreignKey: "userId" });

module.exports = { Users, UserExpenses };