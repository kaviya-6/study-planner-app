const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  code: { 
    type: String, 
    required: true 
  },
  color: { 
    type: String, 
    default: 'from-purple-500 to-indigo-600' 
  },
  image: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop' 
  },
  description: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Course', CourseSchema);
