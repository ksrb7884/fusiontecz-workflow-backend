const {
  createProject,
  inviteMember,
  getMyProjects,
  getProjectById,
} = require("../services/project.service");

const createProjectController = async (req, res, next) => {
  try {
    const project = await createProject(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const inviteMemberController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await inviteMember(req.project, email);

    res.status(200).json({
      success: true,
      message: "Member invited successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyProjectsController = async (req, res, next) => {
  try {
    const projects = await getMyProjects(req.user.id);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleProjectController = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await getProjectById(projectId, req.user.id);

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProjectController,
  inviteMemberController,
  getMyProjectsController,
  getSingleProjectController,
};
