const Order = require("../models/Order");
const User = require("../models/User");
const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(CFEnvironment.SANDBOX, process.env.APP_ID, process.env.APP_SECRET_KEY);

exports.createOrder = async (req, res) => {

    try {

        const orderId = "order_" + Date.now();

        const request = {
            order_amount: 499, // premium price
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: `user_${req.user.userId}`,
                customer_phone: "9999999999" // can store real number
            },
            order_meta: {
                return_url: `http://localhost:3000/payment-status?order_id=${orderId}`
            }
        };

        const response = await cashfree.PGCreateOrder(request);

        // 🔥 Save order in DB
        await Order.create({
            id: orderId,
            status: "PENDING",
            userId: req.user.userId
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

        const response = await cashfree.PGOrderFetchPayments(orderId);

        const payment = response.data[0]; // latest payment

        if (payment.payment_status === "SUCCESS") {

            await Order.update(
                { status: "SUCCESSFUL" },
                { where: { id: orderId } }
            );

            await User.update(
                { isPremium: true },
                { where: { id: req.user.userId } }
            );

            return res.json({ success: true });

        } else {

            await Order.update(
                { status: "FAILED" },
                { where: { id: orderId } }
            );

            return res.json({ success: false });

        }

    } catch (err) {

        console.log(err);
        res.status(500).json({ error: "Verification failed" });

    }

};