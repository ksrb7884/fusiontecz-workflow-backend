const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const projectOwnerMiddleware = require("../middlewares/projectOwner.middleware");
const {
  createProjectController,
  inviteMemberController,
  getMyProjectsController,
  getSingleProjectController,
} = require("../controllers/project.controller");

const router = express.Router();

// CREATE PROJECT
router.post("/", authMiddleware, createProjectController);

// GET MY PROJECTS (OWNER + MEMBER)
router.get("/", authMiddleware, getMyProjectsController);

// GET SINGLE PROJECT (OWNER + MEMBER)
router.get("/:projectId", authMiddleware, getSingleProjectController);

// INVITE MEMBER (OWNER only)
router.post(
  "/:projectId/invite",
  authMiddleware,
  projectOwnerMiddleware,
  inviteMemberController
);

module.exports = router;
