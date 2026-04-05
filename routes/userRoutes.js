const router = require("express").Router();
const userController = require("../controllers/userController");

router.post("/register", userController.createUser);
router.post("/login", userController.login);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);

router.put("/:id", userController.updateUser);
router.delete("/", userController.deleteAllUsers);
router.delete("/:id", userController.deleteUserById);

router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

module.exports = router;