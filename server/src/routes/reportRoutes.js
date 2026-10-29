import express from 'express';
import {
  createReport,
  getReports,
  getReportById,
  getMyReports,
  updateReport,
  deleteReport,
  getReportMatches,
} from '../controllers/reportController.js';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate.js';
import { validateReport } from '../middleware/validate.js';

const router = express.Router();

router.get('/', getReports);
router.get('/mine', authenticate, getMyReports);
router.post('/', authenticate, validateReport, createReport);
router.get('/:id', optionalAuthenticate, getReportById);
router.put('/:id', authenticate, updateReport);
router.delete('/:id', authenticate, deleteReport);
router.get('/:id/matches', authenticate, getReportMatches);

export default router;
