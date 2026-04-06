const UserExpenses = require("../models/Expense");
const User = require("../models/User");
const sequelize = require("../utils/db");
const logger = require("../utils/logger");

exports.createExpense = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const expense = await UserExpenses.create({
            ...req.body,
            userId: req.user.userId
        }, { transaction });

        await User.increment(
            { totalExpense: req.body.amount },
            { where: { id: req.user.userId }, transaction }
        );

        await transaction.commit();
        return res.status(201).json(expense);


    } catch (err) {

        await transaction.rollback();
        logger.error("========================================>");
        logger.error(`ERROR WHILE CREATING EXPENSE: ${err.stack || err.message}`);
        logger.error("========================================>");
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

        logger.error("========================================>");
        logger.error(`ERROR WHILE GETTING EXPENSES: ${err.stack || err.message}`);
        logger.error("========================================>");
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

        logger.error("========================================>");
        logger.error(`ERROR WHILE GETTING EXPENSE BY ID: ${err.stack || err.message}`);
        logger.error("========================================>");
        return res.status(500).json({ error: err.message });

    }

};

exports.updateExpense = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const expense = await UserExpenses.findOne({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        }, { transaction });

        if (!expense) return res.status(404).json({ message: "Not found" });

        const oldAmount = expense.amount;
        const newAmount = req.body.amount;

        const difference = newAmount - oldAmount;

        await User.increment(
            { totalExpense: difference },
            { where: { id: req.user.userId }, transaction }
        );

        await expense.update(req.body, { transaction });

        await transaction.commit();
        return res.json(expense);

    } catch (err) {

        logger.error("========================================>");
        logger.error(`ERROR WHILE UPDATING EXPENSE: ${err.stack || err.message}`);
        logger.error("========================================>");
        await transaction.rollback();
        return res.status(500).json({ error: err.message });

    }

};

exports.deleteExpense = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        const expense = await UserExpenses.findOne({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        }, { transaction });

        if (!expense) return res.status(404).json({ message: "Not found" });

        await User.decrement(
            { totalExpense: expense.amount },
            { where: { id: req.user.userId }, transaction }
        );

        await expense.destroy();
        await transaction.commit();
        return res.json({ message: "Deleted successfully" });

    } catch (err) {

        await transaction.rollback();
        logger.error("========================================>");
        logger.error(`ERROR WHILE DELETING EXPENSE: ${err.stack || err.message}`);
        logger.error("========================================>");
        return res.status(500).json({ error: err.message });

    }

};

exports.deleteAllExpenses = async (req, res) => {

    const transaction = await sequelize.transaction();

    try {

        await UserExpenses.destroy({
            where: { userId: req.user.userId },
        }, { transaction });

        await User.update(
            { totalExpense: 0 },
            { where: { id: req.user.userId }, transaction }
        );

        await transaction.commit();
        return res.json({ message: "All expenses deleted successfully" });

    } catch (err) {

        await transaction.rollback();
        logger.error("========================================>");
        logger.error(`ERROR WHILE DELETING ALL EXPENSES: ${err.stack || err.message}`);
        logger.error("========================================>");
        return res.status(500).json({ error: err.message });

    }

};