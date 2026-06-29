const Course = require('../models/Course');
const Task = require('../models/Task');
const StudySession = require('../models/StudySession');

exports.getVelocity = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id });
    const courseIds = courses.map(c => c._id);

    const totalCourses = courses.length;

    // Fetch tasks metrics
    const tasks = await Task.find({ course: { $in: courseIds } });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Fetch study sessions
    const sessions = await StudySession.find({ course: { $in: courseIds } });
    
    // Total focus minutes (focusType === 'Pomodoro')
    const focusSessions = sessions.filter(s => s.focusType === 'Pomodoro');
    const totalStudyMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration, 0);

    // Calculate daily/weekly metrics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const todayStudyMinutes = focusSessions
      .filter(s => new Date(s.date) >= today)
      .reduce((acc, curr) => acc + curr.duration, 0);

    const thisWeekStudyMinutes = focusSessions
      .filter(s => new Date(s.date) >= startOfWeek)
      .reduce((acc, curr) => acc + curr.duration, 0);

    res.status(200).json({
      analytics: {
        totalCourses,
        totalTasks,
        completedTasks,
        completionRate,
        totalStudyMinutes,
        todayStudyMinutes,
        thisWeekStudyMinutes,
        dailyGoalMinutes: 120,
        weeklyGoalMinutes: 840,
      }
    });
  } catch (error) {
    console.error('Get velocity analytics error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to calculate study velocity.' });
  }
};
