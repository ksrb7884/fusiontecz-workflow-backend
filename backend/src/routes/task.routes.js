const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  createTaskController,
  updateTaskStatusController,
  getTasksController,
} = require("../controllers/task.controller");
const {
  getTaskActivityLogsController,
} = require("../controllers/activityLog.controller");

const router = express.Router();

// CREATE TASK
router.post("/", authMiddleware, createTaskController);

// UPDATE TASK STATUS
router.patch("/:taskId/status", authMiddleware, updateTaskStatusController);

// GET TASKS (KANBAN + PAGINATION)
router.get("/", authMiddleware, getTasksController);

// GET TASK ACTIVITY LOGS
router.get(
  "/:taskId/activity-logs",
  authMiddleware,
  getTaskActivityLogsController
);

module.exports = router;
