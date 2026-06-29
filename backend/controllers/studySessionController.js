const Course = require('../models/Course');
const StudySession = require('../models/StudySession');

exports.getStudySessions = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id });
    const courseIds = courses.map(c => c._id);

    const sessions = await StudySession.find({ course: { $in: courseIds } })
      .populate('course', 'title code')
      .sort({ date: -1 });

    res.status(200).json({ sessions });
  } catch (error) {
    console.error('Get study sessions error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to retrieve study sessions.' });
  }
};

exports.createStudySession = async (req, res) => {
  try {
    const { courseId, duration, focusType } = req.body;

    if (!courseId || !duration || !focusType) {
      return res.status(400).json({ error: 'Course ID, duration, and focus type are required.' });
    }

    // Verify course ownership
    const course = await Course.findOne({ _id: courseId, user: req.user.id });
    if (!course) {
      return res.status(404).json({ error: 'Associated course not found or unauthorized.' });
    }

    const session = new StudySession({
      course: courseId,
      duration,
      focusType,
    });

    await session.save();

    const populatedSession = await StudySession.findById(session._id).populate('course', 'title code');
    res.status(201).json({ session: populatedSession });
  } catch (error) {
    console.error('Create study session error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to log study session.' });
  }
};
