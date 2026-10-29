import express from 'express';
import {
  getUsers,
  updateUserStatus,
  getAdminReports,
  moderateReport,
  getAdminClaims,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin', 'moderator'));

router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/reports', getAdminReports);
router.patch('/reports/:id/moderation', moderateReport);
router.get('/claims', getAdminClaims);
router.get('/audit-logs', getAuditLogs);

export default router;
