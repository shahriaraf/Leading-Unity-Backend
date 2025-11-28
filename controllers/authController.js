const User = require('../models/userModel');
const AppSettings = require('../models/appSettingsModel');
const generateToken = require('../utils/generateToken');

// @desc    Login User
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      console.log('User found:', user.email);
      
      const passwordsMatch = await user.matchPassword(password);

      if (passwordsMatch) {
        console.log('SUCCESS: Passwords matched.');
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          // 🟢 Return these fields so the Flutter Dashboard can show them
          studentId: user.studentId,
          batch: user.batch,
          section: user.section,
          token: generateToken(user._id),
        });
      } else {
        console.log('FAILURE: Password mismatch.');
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      console.log('FAILURE: User not found.');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Register Admin
// @route   POST /api/auth/register/admin-secret
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ message: 'An admin account already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    if (user) {
      console.log(`✅ Admin ${user.email} created!`);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Admin Register Error:", error);
    res.status(500).json({ message: 'Server error during admin registration' });
  }
};

// @desc    Register Student
// @route   POST /api/auth/register/student
const registerStudent = async (req, res) => {
  try {
    // 🟢 FIX: Added studentId, batch, and section here. 
    // Without this, the code crashed because these variables were undefined.
    const { name, email, password, studentId, batch, section } = req.body;
    
    // 1. Check Settings
    const settings = await AppSettings.findOne();
    if (!settings || !settings.isStudentRegistrationOpen) {
      return res.status(400).json({ message: 'Student registration is currently closed.' });
    }
    
    // 2. Check Duplicates
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create User
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: 'student',
      studentId, // Now these variables exist!
      batch,
      section
    });

    if (user) {
      console.log(`✅ Student ${user.email} created!`);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        batch: user.batch,
        section: user.section,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Student Register Error:", error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { loginUser, registerStudent, registerAdmin };