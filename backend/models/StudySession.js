const mongoose = require('mongoose');

const StudySessionSchema = new mongoose.Schema({
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true 
  }, // in minutes
  focusType: { 
    type: String, 
    enum: ['Pomodoro', 'Short Break', 'Long Break'], 
    default: 'Pomodoro' 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('StudySession', StudySessionSchema);
