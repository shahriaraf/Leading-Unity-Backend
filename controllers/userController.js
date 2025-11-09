const User = require('../models/userModel');

const createSupervisor = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'Supervisor with this email already exists' });
  }

  const user = await User.create({ name, email, password, role: 'supervisor' });
  if (user) {
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(400).json({ message: 'Invalid supervisor data' });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: { $in: ['student', 'supervisor'] } });
  res.json(users);
};

// --- THIS IS THE FIXED FUNCTION ---
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (user) {
      // User was found and deleted successfully
      res.json({ message: 'User removed successfully' });
    } else {
      // No user was found with that ID
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    // Handle other potential errors, like an invalid ID format
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};
// --- END OF FIXED FUNCTION ---

module.exports = { createSupervisor, getAllUsers, deleteUser };