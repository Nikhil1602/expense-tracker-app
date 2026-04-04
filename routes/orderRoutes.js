const router = require("express").Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);
router.get("/create-order", orderController.createOrder);
router.post("/verify-payment", orderController.verifyPayment);

module.exports = router;