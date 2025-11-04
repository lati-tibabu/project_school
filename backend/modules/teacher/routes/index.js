const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticate, authorize } = require('../../../middleware/auth');

router.use(authenticate);

router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacher);
router.post('/', authorize('super_admin', 'admin'), teacherController.createTeacher);
router.put('/:id', authorize('super_admin', 'admin'), teacherController.updateTeacher);
router.delete('/:id', authorize('super_admin', 'admin'), teacherController.deleteTeacher);

module.exports = router;
