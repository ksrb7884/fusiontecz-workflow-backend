const Project = require("../models/Project.model");

const projectOwnerMiddleware = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only project owner can perform this action",
      });
    }

    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = projectOwnerMiddleware;
