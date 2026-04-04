const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", expenseController.createExpense);
router.get("/", expenseController.getExpenses);
router.get("/:id", expenseController.getExpenseById);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);
router.delete("/", expenseController.deleteAllExpenses);

module.exports = router;