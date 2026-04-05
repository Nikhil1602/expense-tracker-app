const Order = require("../models/Order");
const User = require("../models/User");
const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(CFEnvironment.SANDBOX, process.env.APP_ID, process.env.APP_SECRET_KEY);

exports.createOrder = async (req, res) => {

    try {

        const orderId = "order_" + Date.now();

        const request = {
            order_amount: 499,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: `user_${req.user.userId}`,
                customer_phone: "9876543210" // can store real number
            },
            order_meta: {
                return_url: `http://localhost:3000/payment-status.html?order_id=${orderId}`
            }
        };

        const response = await cashfree.PGCreateOrder(request);

        // 🔥 Save order in DB
        await Order.create({
            id: orderId,
            status: "PENDING",
            userId: req.user.userId,
            amount: 499
        });

        return res.json({
            orderId,
            paymentSessionId: response.data.payment_session_id
        });

    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Order creation failed" });

    }

};

exports.verifyPayment = async (req, res) => {

    const { orderId } = req.body;

    try {

        const order = await Order.findOne({ where: { id: orderId } });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // 🔥 prevent duplicate updates
        if (order.status === "SUCCESSFUL") {
            return res.json({ success: true });
        }

        const response = await cashfree.PGOrderFetchPayments(orderId);

        if (!response.data || response.data.length === 0) {
            return res.json({ success: false });
        }

        const payment = response.data[0]; // latest payment

        if (payment.payment_status === "SUCCESS") {

            await Order.update(
                { status: "SUCCESSFUL", paymentId: payment.cf_payment_id },
                { where: { id: orderId } }
            );

            await User.update(
                { isPremium: true },
                { where: { id: order.userId } }
            );

            return res.json({ success: true });

        } else {

            await Order.update(
                { status: "FAILED", paymentId: payment.cf_payment_id },
                { where: { id: orderId } }
            );

            return res.json({ success: false });

        }

    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Verification failed" });

    }

};