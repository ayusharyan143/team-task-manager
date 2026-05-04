const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, createProject).get(protect, getProjects);

router.delete("/:id", protect, deleteProject);

module.exports = router;
