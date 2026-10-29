import express from 'express';
import {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  getClaimById,
  updateClaimStatus,
  updateHandover,
} from '../controllers/claimController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateClaim } from '../middleware/validate.js';

const router = express.Router();

router.use(authenticate);

router.post('/', validateClaim, createClaim);
router.get('/mine', getMyClaims);
router.get('/received', getReceivedClaims);
router.get('/:id', getClaimById);
router.patch('/:id/status', updateClaimStatus);
router.patch('/:id/handover', updateHandover);

export default router;
