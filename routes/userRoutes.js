const express = require("express")
const userController = require("../controller/userController")
const verifyToken = require("../utils/verifyToken")

const router = express.Router();


router.post("/api/signup", userController.signup)
router.post("/api/login", userController.login)
router.get("/api/home/:id", verifyToken, userController.getHome)
router.post("/api/home/tasks/", verifyToken, userController.createTask)
router.get("/api/home/tasks", verifyToken, userController.getAllTasks)
router.patch("/api/home/tasks/:taskId", verifyToken, userController.updateTask)
router.delete("/api/home/tasks/:taskId", verifyToken, userController.deleteTask)

module.exports = router;