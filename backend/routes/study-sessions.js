const express = require('express');
const router = express.Router();
const studySessionController = require('../controllers/studySessionController');
const auth = require('../middleware/auth');

// Protect all study session routes
router.use(auth);

router.get('/', studySessionController.getStudySessions);
router.post('/', studySessionController.createStudySession);

module.exports = router;
