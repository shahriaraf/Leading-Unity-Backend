const express = require('express');
const { createSupervisor, getAllUsers, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getAllUsers);
router.route('/supervisor').post(protect, createSupervisor);
router.route('/:id').delete(protect, admin, deleteUser);

module.exports = router;