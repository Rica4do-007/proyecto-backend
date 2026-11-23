const mongoose = require('mongoose');
const validator = require('validator'); // Email format validation
const bcrypt = require('bcryptjs'); // Password encryption

const UserSchema = new mongoose.Schema({
  // Part 3 - Steps 3 and 4: Define the User structure
  email: { 
    type: String, 
    // Part 5: Data validations
    required: true, // Required field
    unique: true, // Prevent duplicate email addresses
    lowercase: true, // Convert email to lowercase
    validate: {
      validator: validator.isEmail, // Validate email format
      message: 'Invalid email format' 
    }
  },
  
  password: { 
    type: String,
    // Part 5: Data validations
    required: true, // Required field
    minlength: 6 // Minimum password length
  },

  createdAt: { 
    type: Date, 
    default: Date.now // Default value: current date and time
  }
});

// Part 3 - Steps 6 and 7 (Security): Password encryption
// This middleware runs before saving the user to the database
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); 
});

module.exports = mongoose.model('Users', UserSchema);