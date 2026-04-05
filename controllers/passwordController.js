require('dotenv').config();

const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");
const User = require("../models/User");
const emailApi = require('../utils/email');
const { Op } = require('sequelize');
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Forgot Password
exports.forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const token = crypto.randomBytes(32).toString("hex");

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        const { v4: uuidv4 } = await import("uuid");

        const id = uuidv4();

        await ForgotPasswordRequest.create({
            id,
            UserId: user.id
        });

        const resetLink = `http://localhost:3000/reset-password.html?token=${token}&rid=${id}`;

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

    const { token, password, rid } = req.body;

    try {

        let request = null;

        if (rid) {
            request = await ForgotPasswordRequest.findOne({
                where: { id: rid }
            });

            if (!request || !request.isActive) {
                return res.status(400).json({ message: "Invalid or expired request" });
            }
        }

        const user = await User.findOne({
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

        if (request) {
            request.isActive = false;
            await request.save();
        }

        return res.json({ message: "Password reset successful" });

    } catch (err) {

        console.log(err);

        return res.status(500).json({ error: "Failed" });

    }

};