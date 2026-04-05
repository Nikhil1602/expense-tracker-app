const UserExpenses = require("../models/Expense");
const User = require("../models/User");

exports.createExpense = async (req, res) => {

    try {

        const expense = await UserExpenses.create({
            ...req.body,
            userId: req.user.userId
        });

        await User.increment(
            { totalExpense: req.body.amount },
            { where: { id: req.user.userId } }
        );

        return res.status(201).json(expense);

    } catch (err) {

        return res.status(500).json({ error: err.message });

    }

};

exports.getExpenses = async (req, res) => {

    try {

        const expenses = await UserExpenses.findAll({
            where: { userId: req.user.userId },
            order: [["date", "DESC"]],
        });

        const user = await User.findByPk(req.user.userId);

        return res.json({
            expenses,
            isPremium: user.isPremium,
            totalExpense: user.totalExpense
        });

    } catch (err) {

        return res.status(500).json({ error: err.message });

    }

};

exports.getExpenseById = async (req, res) => {

    try {

        const expense = await UserExpenses.findOne({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        });

        if (!expense) return res.status(404).json({ message: "Not found" });

        return res.json(expense);

    } catch (err) {

        return res.status(500).json({ error: err.message });

    }

};

exports.updateExpense = async (req, res) => {

    try {

        const expense = await UserExpenses.findOne({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        });

        if (!expense) return res.status(404).json({ message: "Not found" });

        const oldAmount = expense.amount;
        const newAmount = req.body.amount;

        const difference = newAmount - oldAmount;

        await User.increment(
            { totalExpense: difference },
            { where: { id: req.user.userId } }
        );

        await expense.update(req.body);

        return res.json(expense);

    } catch (err) {

        return res.status(500).json({ error: err.message });

    }

};

exports.deleteExpense = async (req, res) => {

    try {

        const expense = await UserExpenses.findOne({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        });

        if (!expense) return res.status(404).json({ message: "Not found" });

        await User.decrement(
            { totalExpense: expense.amount },
            { where: { id: req.user.userId } }
        );

        await expense.destroy();
        return res.json({ message: "Deleted successfully" });

    } catch (err) {

        return res.status(500).json({ error: err.message });

    }

};

exports.deleteAllExpenses = async (req, res) => {

    try {

        await UserExpenses.destroy({
            where: { userId: req.user.userId },
        });

        await User.update(
            { totalExpense: 0 },
            { where: { id: req.user.userId } }
        );

        return res.json({ message: "All expenses deleted successfully" });

    } catch (err) {

        return res.status(500).json({ error: err.message });

    }

};