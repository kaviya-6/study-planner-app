require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());

// Disable buffering of commands when disconnected to prevent pending API requests from hanging
mongoose.set('bufferCommands', false);

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error event:', err.message);
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected successfully.'))
  .catch((err) => {
    console.error('MongoDB Atlas connection error:', err.message);
    console.log('👉 TIP: If you see a connection error, please ensure that your MongoDB Atlas Network Access is set to allow connections from all IPs (0.0.0.0/0) for testing.');
  });

// Routes Definitions
app.use('/auth', require('./routes/auth'));
app.use('/courses', require('./routes/courses'));
app.use('/tasks', require('./routes/tasks'));
app.use('/study-sessions', require('./routes/study-sessions'));
app.use('/analytics', require('./routes/analytics'));

app.get('/', (req, res) => {
  res.send('Study Planner API is running...');
});

// Centralized Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
