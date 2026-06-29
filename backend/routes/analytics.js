const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Protect all analytics routes
router.use(auth);

router.get('/velocity', analyticsController.getVelocity);

module.exports = router;
