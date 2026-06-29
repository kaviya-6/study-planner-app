const Course = require('../models/Course');
const Task = require('../models/Task');
const StudySession = require('../models/StudySession');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    console.error('Get courses error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to retrieve courses.' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, code, color, image, description } = req.body;

    if (!title || !code) {
      return res.status(400).json({ error: 'Course title and code are required.' });
    }

    const course = new Course({
      user: req.user.id,
      title,
      code,
      color,
      image,
      description
    });

    await course.save();
    res.status(201).json({ course });
  } catch (error) {
    console.error('Create course error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to create course.' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, user: req.user.id });
    if (!course) {
      return res.status(404).json({ error: 'Course not found or unauthorized.' });
    }

    // Cascade deletes
    await Task.deleteMany({ course: course._id });
    await StudySession.deleteMany({ course: course._id });

    await course.deleteOne();

    res.status(200).json({ message: 'Course and all associated tasks and focus blocks deleted successfully.' });
  } catch (error) {
    console.error('Delete course error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to delete course.' });
  }
};
