const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const { authenticate, authorize } = require('../../../middleware/auth');

router.use(authenticate);

router.get('/', financeController.getTransactions);
router.get('/:id', financeController.getTransaction);
router.post('/', authorize('super_admin', 'admin'), financeController.createTransaction);
router.put('/:id', authorize('super_admin', 'admin'), financeController.updateTransaction);
router.delete('/:id', authorize('super_admin', 'admin'), financeController.deleteTransaction);

module.exports = router;
