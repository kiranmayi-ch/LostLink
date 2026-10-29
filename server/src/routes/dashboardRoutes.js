import express from 'express';
import { getUserDashboard, getAdminDashboard } from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(authenticate);

router.get('/user', getUserDashboard);
router.get('/admin', authorize('admin', 'moderator'), getAdminDashboard);

export default router;
