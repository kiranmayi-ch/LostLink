import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRegister, validateLogin } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
