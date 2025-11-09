const User = require('../models/userModel');
const AppSettings = require('../models/appSettingsModel');
const generateToken = require('../utils/generateToken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    console.log('User found in database:', user.email);
    console.log('Hashed password in database:', user.password);
    
    const passwordsMatch = await user.matchPassword(password);
    console.log('Do the passwords match?', passwordsMatch);

    if (passwordsMatch) {
      // This is the success path
      console.log('SUCCESS: Passwords matched. Generating token.');
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // This is the password mismatch path
      console.log('FAILURE: Passwords did not match.');
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } else {
    // This is the user not found path
    console.log('FAILURE: No user found with that email.');
    res.status(401).json({ message: 'Invalid email or password' });
  }
};


// ADD THIS NEW FUNCTION
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  // Optional: Prevent creating more than one admin
  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    return res.status(400).json({ message: 'An admin account already exists.' });
  }

  const user = await User.create({
    name,
    email,
    password, // The userModel 'pre.save' hook will hash this automatically
    role: 'admin',
  });

  if (user) {
    console.log(`✅ SUCCESS: Admin user ${user.email} created successfully!`);
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
};


const registerStudent = async (req, res) => {
  const { name, email, password } = req.body;
  const settings = await AppSettings.findOne();

  if (!settings || !settings.isStudentRegistrationOpen) {
    return res.status(400).json({ message: 'Student registration is currently closed.' });
  }
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, role: 'student' });

  if (user) {
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
};

module.exports = { loginUser, registerStudent, registerAdmin };