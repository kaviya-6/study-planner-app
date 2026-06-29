const Course = require('../models/Course');
const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    // Find all courses for the user
    const courses = await Course.find({ user: req.user.id });
    const courseIds = courses.map(c => c._id);

    // Find tasks for these courses
    const tasks = await Task.find({ course: { $in: courseIds } }).sort({ deadline: 1 });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to retrieve tasks.' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { courseId, title, deadline } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({ error: 'Course ID and title are required.' });
    }

    // Verify course ownership
    const course = await Course.findOne({ _id: courseId, user: req.user.id });
    if (!course) {
      return res.status(404).json({ error: 'Associated course not found or unauthorized.' });
    }

    const task = new Task({
      course: courseId,
      title,
      deadline: deadline || undefined,
      status: 'To Do',
    });

    await task.save();
    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to create task.' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, deadline, status } = req.body;

    const task = await Task.findById(id).populate('course');
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Verify course user ownership
    if (task.course.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this task.' });
    }

    if (title !== undefined) task.title = title;
    if (deadline !== undefined) task.deadline = deadline;
    if (status !== undefined) task.status = status;

    await task.save();
    res.status(200).json({ task });
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to update task.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('course');
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    // Verify course user ownership
    if (task.course.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this task.' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to delete task.' });
  }
};
