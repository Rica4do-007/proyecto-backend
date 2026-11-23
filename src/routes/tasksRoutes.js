const express = require('express');
const router = express.Router();
const taskControllers = require('../controllers/tasksControllers'); 
const auth = require('../middlewares/authMiddleware');

// Part 4 - Tasks Module: CRUD Operations
// All routes require the 'auth' middleware (Security/Token)

// Step 9: Create task (POST /app/tasks)
router.post('/', auth, taskControllers.createTask);

// Step 10: Get the user's tasks (GET /app/tasks)
router.get('/', auth, taskControllers.getTasks);

// Step 11: Update task (PUT /app/tasks/:id)
router.put('/:id', auth, taskControllers.updateTask);

// Step 11: Delete task (DELETE /app/tasks/:id)
router.delete('/:id', auth, taskControllers.deleteTask);

// Export for use in app.js
module.exports = router;