const express = require('express');
const router = express.Router();
const campusController = require('../controllers/campusController');
const { authenticate, authorize } = require('../../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.get('/', campusController.getAllCampuses);
router.get('/:id', campusController.getCampus);
router.post('/', authorize('super_admin', 'admin'), campusController.createCampus);
router.put('/:id', authorize('super_admin', 'admin'), campusController.updateCampus);
router.delete('/:id', authorize('super_admin'), campusController.deleteCampus);

module.exports = router;
