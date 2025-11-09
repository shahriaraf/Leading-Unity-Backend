const express = require('express');
const router = express.Router();
const { getSettings, toggleRegistration } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

// public route for flutter app to check
router.route('/').get(getSettings); 
// admin-only route to change setting
router.route('/toggle-registration').patch(protect, admin, toggleRegistration); 

module.exports = router;