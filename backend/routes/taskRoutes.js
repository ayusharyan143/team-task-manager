const express = require("express");
const router = express.Router();

const {
  createTask,
  updateTaskStatus,
  getDashboardStats,
  getTasks,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

router.get("/stats", protect, getDashboardStats);
router.get("/", protect, getTasks);
router.post("/", protect, createTask);

router.put("/:id", protect, updateTask);

router.patch("/:id/status", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);

module.exports = router;
