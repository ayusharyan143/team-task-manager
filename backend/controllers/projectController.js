// backend/controllers/projectController.js
const Project = require('../models/Project');
const User = require('../models/User');

// Admin creates a project
exports.createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      admin: req.user.id,
      members: [req.user.id] 
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin adds a member to their project
exports.addMember = async (req, res) => {
  try {
    const { projectId, memberEmail } = req.body;
    const project = await Project.findById(projectId);
    const userToAdd = await User.findOne({ email: memberEmail });

    if (!userToAdd) return res.status(404).json({ message: "User not found" });
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    // Authorization check
    if (project.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only project admins can add members" });
    }

    if (!project.members.includes(userToAdd._id)) {
      project.members.push(userToAdd._id);
      await project.save();
    }
    res.json({ message: "Member added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get projects (Admin sees created, Member sees assigned)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id })
      .populate('admin', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all users so Admin can assign them
exports.getAllUsers = async (req, res) => {
  try {
    // Only return Members, not other Admins
    const users = await User.find({ role: 'Member' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a user to a project
exports.addMemberToProject = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });
    
    // Security: Only the Admin of this project can add members
    if (project.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.json({ message: "Member added successfully", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Optional: Only Admin can delete projects
    if (req.user.role !== 'Admin') {
      return res.status(401).json({ message: "Unauthorized: Only Admins can delete projects" });
    }

    await project.deleteOne();
    res.json({ message: "Project removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};