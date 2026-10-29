import { ApiError } from '../utils/ApiError.js';
import { CATEGORIES } from '../models/ItemReport.js';

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push('Email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

export const validateReport = (req, res, next) => {
  const { title, description, category, reportType, approximateLocation } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Item title must be at least 3 characters');
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!category || !CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${CATEGORIES.join(', ')}`);
  }

  if (!reportType || !['lost', 'found'].includes(reportType)) {
    errors.push('Report type must be either lost or found');
  }

  if (!approximateLocation || typeof approximateLocation !== 'string' || !approximateLocation.trim()) {
    errors.push('Approximate location is required');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

export const validateClaim = (req, res, next) => {
  const { claimMessage } = req.body;
  const errors = [];

  if (!claimMessage || typeof claimMessage !== 'string' || claimMessage.trim().length < 10) {
    errors.push('Claim message must be at least 10 characters explaining your ownership proof');
  }

  if (errors.length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};
