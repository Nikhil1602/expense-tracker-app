require('dotenv').config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Users = require("../models/User");
const jwt = require("jsonwebtoken");
const emailApi = require('../utils/email');
const { Op } = require('sequelize');

// Create User
exports.createUser = async (req, res) => {

    const { name, email, password } = req.body;

    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
        return res.status(400).json({ error: "User already registered" });
    }

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Users.create({ ...req.body, password: hashedPassword });
    return res.json(user);

};

// Login User
exports.login = async (req, res) => {

    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔐 Generate token
    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return res.json({ message: "Login successful", token });

};

// Get all Users
exports.getUsers = async (req, res) => {

    try {

        const users = await Users.findAll();

        if (users.length === 0) {
            return res.status(404).json({ error: "No Users found" });
        }

        res.json(users);

    } catch (err) {

        console.error("FULL ERROR:", err); // 👈 IMPORTANT
        return res.status(500).json({ error: err.message });

    }

};

// UPDATE User
exports.updateUser = async (req, res) => {

    try {

        const user = await Users.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.update(req.body);
        return res.json(user);

    } catch (err) {

        console.error("FULL ERROR:", err); // 👈 IMPORTANT
        return res.status(500).json({ error: err.message });

    }

};

// DELETE ALL UserS
exports.deleteAllUsers = async (req, res) => {

    try {

        await Users.destroy({
            where: {},
            truncate: true
        });

        return res.json({ message: "All Users deleted" });

    } catch (err) {

        console.error("FULL ERROR:", err); // 👈 IMPORTANT
        return res.status(500).json({ error: err.message });

    }

};

// DELETE User BY ID
exports.deleteUserById = async (req, res) => {

    try {

        const user = await Users.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();
        return res.json({ message: "User deleted" });

    } catch (err) {

        console.error("FULL ERROR:", err); // 👈 IMPORTANT
        return res.status(500).json({ error: err.message });

    }

};

// Get User by ID
exports.getUserById = async (req, res) => {

    try {

        const user = await Users.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json(user);

    } catch (err) {

        console.error("FULL ERROR:", err); // 👈 IMPORTANT
        return res.status(500).json({ error: err.message });

    }

};

// Forgot Password
exports.forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = crypto.randomBytes(32).toString("hex");

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `http://localhost:3000/reset-password.html?token=${token}`;

        await emailApi.sendTransacEmail({
            sender: { email: process.env.SENDER_EMAIL },
            to: [{ email }],
            subject: "Reset Your Password",
            htmlContent: `
                <h3>Password Reset</h3>
                <p>Click below to reset:</p>
                <a href="${resetLink}">Reset Password</a>
            `
        });

        return res.json({ message: "Reset link sent to email" });

    } catch (err) {

        console.log(err);
        return res.status(500).json({ error: "Something failed" });

    }

};

// Reset Password
exports.resetPassword = async (req, res) => {

    const { token, password } = req.body;

    try {

        const user = await Users.findOne({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await user.save();

        return res.json({ message: "Password reset successful" });

    } catch (err) {

        console.log(err);

        return res.status(500).json({ error: "Failed" });

    }

};