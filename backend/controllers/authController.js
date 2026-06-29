const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const normalizeEmail = (email) => String(email).trim().toLowerCase();

exports.register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email, and password.' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    user = new User({
      name,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT Token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            streak: user.streak,
          },
        });
      }
    );
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to register user.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    const email = normalizeEmail(req.body.email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            streak: user.streak,
          },
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to log in.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User profile not found.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ error: 'Server error. Failed to retrieve profile.' });
  }
};
