const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../../middleware/auth');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
