const Task = require("../models/Task");
const mongoose = require("mongoose");

exports.getTasks = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "Admin") {
      query = { createdBy: req.user.id };
    } else {
      query = { assignedTo: req.user.id };
    }

    const tasks = await Task.find(query).populate("assignedTo", "name");
    res.json(tasks);
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "Admin") {
      query = { createdBy: req.user.id };
    } else {
      query = { assignedTo: req.user.id };
    }

    const tasks = await Task.find(query);

    const stats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "To Do").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      done: tasks.filter((t) => t.status === "Done").length,
      overdue: tasks.filter(
        (t) => new Date(t.dueDate) < new Date() && t.status !== "Done",
      ).length,
    };

    res.json(stats);
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "Admin")
      return res.status(401).json({ message: "Unauthorized" });

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
