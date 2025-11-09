const express = require('express');
// UPDATE THIS LINE
const { loginUser, registerStudent, registerAdmin } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register/student', registerStudent);
router.post('/register/admin-secret', registerAdmin);

module.exports = router;