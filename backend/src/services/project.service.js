const User = require("../models/User.model");
const Project = require("../models/Project.model");

const createProject = async ({ name, description }, userId) => {
  if (!name) {
    const error = new Error("Project name is required");
    error.statusCode = 400;
    throw error;
  }

  const project = await Project.create({
    name,
    description,
    owner: userId, // 👈 OWNER yahin set hota hai
    members: [],
  });

  return project;
};

const inviteMember = async (project, email) => {
  if (!email) {
    const error = new Error("Member email is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // owner ko member list me add nahi karna
  if (project.owner.toString() === user._id.toString()) {
    const error = new Error("Owner is already part of the project");
    error.statusCode = 400;
    throw error;
  }

  // already member check
  if (project.members.includes(user._id)) {
    const error = new Error("User already a project member");
    error.statusCode = 400;
    throw error;
  }

  project.members.push(user._id);
  await project.save();

  return {
    projectId: project._id,
    memberId: user._id,
    email: user.email,
  };
};

const getMyProjects = async (userId) => {
  const projects = await Project.find({
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", "name email")
    .populate("members", "name email")
    .sort({ createdAt: -1 });

  return projects;
};

const getProjectById = async (projectId, userId) => {
  const project = await Project.findById(projectId)
    .populate("owner", "name email")
    .populate("members", "name email");

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = project.owner._id.toString() === userId;
  const isMember = project.members.some(
    (member) => member._id.toString() === userId
  );

  if (!isOwner && !isMember) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  return project;
};

module.exports = {
  createProject,
  inviteMember,
  getMyProjects,
  getProjectById,
};
