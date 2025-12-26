const Task = require("../models/Task.model");
const Project = require("../models/Project.model");
const User = require("../models/User.model");
const ActivityLog = require("../models/ActivityLog.model");

const createTask = async (
  { title, description, priority, assignee, projectId },
  userId
) => {
  if (!title || !projectId) {
    const error = new Error("Title and projectId are required");
    error.statusCode = 400;
    throw error;
  }

  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  // OWNER or MEMBER check
  const isOwner = project.owner.toString() === userId;
  const isMember = project.members.includes(userId);

  if (!isOwner && !isMember) {
    const error = new Error("Not authorized to create task in this project");
    error.statusCode = 403;
    throw error;
  }

  // Assignee validation (optional)
  if (assignee) {
    const user = await User.findById(assignee);
    if (!user) {
      const error = new Error("Assignee not found");
      error.statusCode = 404;
      throw error;
    }

    const isAssigneeAllowed =
      project.owner.toString() === assignee ||
      project.members.includes(assignee);

    if (!isAssigneeAllowed) {
      const error = new Error("Assignee is not part of the project");
      error.statusCode = 400;
      throw error;
    }
  }

  const task = await Task.create({
    title,
    description,
    priority,
    assignee,
    projectId,
    createdBy: userId,
  });

  return task;
};

const ALLOWED_TRANSITIONS = {
  BACKLOG: ["IN_PROGRESS"],
  IN_PROGRESS: ["REVIEW"],
  REVIEW: ["DONE"],
  DONE: [],
};

const updateTaskStatus = async (taskId, newStatus, userId) => {
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

  // OWNER or MEMBER check
  const isOwner = project.owner.toString() === userId;
  const isMember = project.members.includes(userId);

  if (!isOwner && !isMember) {
    const error = new Error("Not authorized to update task");
    error.statusCode = 403;
    throw error;
  }

  const currentStatus = task.status;
  const allowedNextStates = ALLOWED_TRANSITIONS[currentStatus];

  if (!allowedNextStates.includes(newStatus)) {
    const error = new Error(
      `Invalid status transition from ${currentStatus} to ${newStatus}`
    );
    error.statusCode = 400;
    throw error;
  }

  // update task
  task.status = newStatus;
  await task.save();

  // activity log
  await ActivityLog.create({
    taskId: task._id,
    action: "STATUS_CHANGE",
    previousValue: { status: currentStatus },
    newValue: { status: newStatus },
    performedBy: userId,
  });

  return task;
};

const getTasksByProject = async (projectId, userId, page = 1, limit = 10) => {
  const project = await Project.findById(projectId);
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

  const skip = (page - 1) * limit;

  const tasks = await Task.find({ projectId })
    .select("title description status priority assignee createdAt")
    .populate("assignee", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalTasks = await Task.countDocuments({ projectId });

  // Kanban grouping
  const kanban = {
    BACKLOG: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  };

  tasks.forEach((task) => {
    kanban[task.status].push(task);
  });

  return {
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
    },
    kanban,
  };
};

module.exports = { createTask, updateTaskStatus, getTasksByProject };
