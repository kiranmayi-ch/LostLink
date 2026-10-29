import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/me', getProfile);
router.put('/me', updateProfile);

export default router;
