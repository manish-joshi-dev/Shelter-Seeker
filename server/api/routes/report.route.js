import express from 'express';
import { verifyToken } from '../utils/verifyToken.js';
import { createReport, getUserReports } from '../controller/report.controller.js';

const router = express.Router();

// Protected routes (require authentication)
router.post('/create', verifyToken, createReport);
router.get('/user', verifyToken, getUserReports);

export default router;
