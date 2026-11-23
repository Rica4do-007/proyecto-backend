const Task = require('../models/tasks');

// Part 4 - Step 9: Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Assign the user ID from the token (Security - Part 3)
    const newTask = new Task({
      title,
      description,
      user_id: req.user.id 
    });

    await newTask.save();
    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    // Part 6: Error Handling
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// Part 4 - Step 10: Retrieve Tasks
exports.getTasks = async (req, res) => {
  try {
    // Filter by user_id so users only see their own tasks
    const tasks = await Task.find({ user_id: req.user.id });
    res.json(tasks);
  } catch (error) {
    // Part 6: Error Handling
    res.status(500).json({ message: "Error retrieving tasks", error: error.message });
  }
};

// Part 4 - Step 11: Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id }, // Ownership validation
      req.body, 
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task updated", task });
  } catch (error) {
    // Part 6: Error Handling
    // Mongoose validation errors should consistently return status 400
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: true, 
        message: error.message
      });
    }

    res.status(500).json({ 
      error: true, 
      message: "Error updating task" 
    });
  }
};

// Part 4 - Step 11: Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    // Part 6: Error Handling
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};