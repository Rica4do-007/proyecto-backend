const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  // Part 4 - Step 8: Define the Task structure
  title: { 
    type: String, 
    // Part 5: Data validations
    required: true // Required field for validation
  },
  
  description: { 
    type: String 
  },
  
  status: { 
    type: String, 
    // Part 5: Data validations
    enum: {
      values: ['pending', 'in_progress', 'done'],
      message: '{VALUE} it is not a valid status'
    },
    default: 'pending' 
  },
  
  due_date: { 
    type: Date 
  },
  
  // Part 4 - Step 8: Collection relationship
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Establishes a "1 user to many tasks" relationship
    required: true 
  }
});

// Part 4 - Step 8: Export the model for use in the project
module.exports = mongoose.model('Tasks', TaskSchema);