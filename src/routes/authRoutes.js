const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');

// Part 3 - Step 6: Routes for the Users Module
// Registration route: POST /app/auth/register
router.post('/register', authControllers.registerUser);

// Part 3 - Step 7: Authentication routes
// Login route: POST /app/auth/login
router.post('/login', authControllers.login);

// Export the router for use in app.js (Part 2)
module.exports = router;