const ActivityLog = require("../models/ActivityLog.model");
const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

const getTaskActivityLogs = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  const project = await Project.findById(task.projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  // OWNER / MEMBER access check
  const isOwner = project.owner.toString() === userId;
  const isMember = project.members.includes(userId);

  if (!isOwner && !isMember) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  const logs = await ActivityLog.find({ taskId })
    .populate("performedBy", "name email")
    .sort({ createdAt: -1 });

  return logs;
};

module.exports = { getTaskActivityLogs };
