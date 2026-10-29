import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      institution: user.institution,
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, institution } = req.body;
  const updates = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2) {
      throw new ApiError(400, 'Name must be at least 2 characters long');
    }
    updates.name = name.trim();
  }

  if (phone !== undefined) {
    updates.phone = typeof phone === 'string' ? phone.trim() : '';
  }

  if (institution !== undefined) {
    updates.institution = typeof institution === 'string' ? institution.trim() : 'Campus Community';
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      institution: updatedUser.institution,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  });
});
