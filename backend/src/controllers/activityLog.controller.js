const { getTaskActivityLogs } = require("../services/activityLog.service");

const getTaskActivityLogsController = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const logs = await getTaskActivityLogs(taskId, req.user.id);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTaskActivityLogsController };
