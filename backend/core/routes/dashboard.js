const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);

router.get('/', dashboardController.getDashboard);
router.get('/modules', dashboardController.getModules);

module.exports = router;
