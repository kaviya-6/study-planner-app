const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

// Protect all course routes
router.use(auth);

router.get('/', courseController.getCourses);
router.post('/', courseController.createCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
