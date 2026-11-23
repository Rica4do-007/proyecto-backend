const User = require('../models/users'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

// Part 3 - Step 5: User Registration
// Register a new user in the database
exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // The 'User' model encrypts the password (Security - Part 3)
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Part 6: Error Handling (Invalid fields or duplicate email)
    res.status(400).json({ message: "Error registering user", error: error.message });
  }
};

// Part 3 - Step 6: Login and Token Generation
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check whether the user exists (Security)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2. Compare the entered password with the hashed password (bcrypt)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 3. Generate the JWT token (Step 7: Authentication)
    // Uses JWT_SECRET defined in the .env file
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h' 
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    // Part 6: Server error handling
    res.status(500).json({ message: "Server error", error: error.message });
  }
};