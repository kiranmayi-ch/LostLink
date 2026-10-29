import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'lostlink_super_secure_jwt_secret_key_campus_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, institution } = req.body;

  // Check duplicate email
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email address already exists.');
  }

  // Hash password
  const passwordHash = await User.hashPassword(password);

  // Prevent role injection: default role is always 'user'
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    phone: phone ? phone.trim() : '',
    institution: institution ? institution.trim() : 'Campus Community',
    role: 'user',
    accountStatus: 'active',
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful! Welcome to LostLink.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      institution: user.institution,
      createdAt: user.createdAt,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (user.accountStatus === 'suspended') {
    throw new ApiError(403, 'Your account has been suspended. Please contact campus administration.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      institution: user.institution,
      createdAt: user.createdAt,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      institution: req.user.institution,
      createdAt: req.user.createdAt,
    },
  });
});
