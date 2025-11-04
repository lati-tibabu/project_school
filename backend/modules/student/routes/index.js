const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, authorize } = require('../../../middleware/auth');

router.use(authenticate);

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudent);
router.post('/', authorize('super_admin', 'admin', 'teacher'), studentController.createStudent);
router.put('/:id', authorize('super_admin', 'admin', 'teacher'), studentController.updateStudent);
router.delete('/:id', authorize('super_admin', 'admin'), studentController.deleteStudent);

module.exports = router;
