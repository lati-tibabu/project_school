const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../../../middleware/auth');

router.use(authenticate);

router.get('/', attendanceController.getAttendance);
router.post('/', authorize('super_admin', 'admin', 'teacher'), attendanceController.markAttendance);
router.put('/:id', authorize('super_admin', 'admin', 'teacher'), attendanceController.updateAttendance);
router.delete('/:id', authorize('super_admin', 'admin'), attendanceController.deleteAttendance);

module.exports = router;
