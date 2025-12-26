const {
  createTask,
  updateTaskStatus,
  getTasksByProject,
} = require("../services/task.service");

const createTaskController = async (req, res, next) => {
  try {
    const task = await createTask(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTaskStatusController = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await updateTaskStatus(taskId, status, req.user.id);

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const getTasksController = async (req, res, next) => {
  try {
    const { projectId, page = 1, limit = 10 } = req.query;

    if (!projectId) {
      const error = new Error("projectId query param is required");
      error.statusCode = 400;
      throw error;
    }

    const data = await getTasksByProject(projectId, req.user.id, page, limit);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTaskController,
  updateTaskStatusController,
  getTasksController,
};
