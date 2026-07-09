const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, location, farmDetails, buyerDetails } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const user = await User.create({
      name, email, password, role, phone, location,
      ...(role === 'farmer' && farmDetails ? { farmDetails } : {}),
      ...(role === 'buyer' && buyerDetails ? { buyerDetails } : {})
    });
    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Registration successful! Welcome to Krishi Setu.',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account deactivated. Contact support.' });
    }
    const token = generateToken(user._id);
    res.json({
      message: `Welcome back, ${user.name}!`,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, farmDetails: user.farmDetails, buyerDetails: user.buyerDetails }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile.', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, farmDetails, buyerDetails } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, location, farmDetails, buyerDetails },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated successfully.', user });
  } catch (error) {
    res.status(500).json({ message: 'Profile update failed.', error: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile };