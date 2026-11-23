const jwt = require('jsonwebtoken');

// Part 3 - Steps 6 and 7: Authentication Middleware (Security)
// This file protects the project's private routes.
module.exports = (req, res, next) => {
  // 1. Get the token from the 'Authorization' header
  const authHeader = req.header('Authorization');

  // Part 6: Error Handling (Missing Token)
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }

  // The format is usually "Bearer TOKEN", so extract only the token
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token using the secret key (Security - Part 3)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Store user data in the request for use by the Tasks module
    req.user = decodedToken; 
    
    next(); // Continue to the next function (Controller)
  } catch (error) {
    // Part 6: Error Handling (Invalid or expired token)
    res.status(400).json({ message: "Invalid token" });
  }
};