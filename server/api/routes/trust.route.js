import express from 'express';
import { verifyAdmin, verifyToken } from '../utils/verifyToken.js';
import {
    updateTrustPoints,
    getSellerProfile,
    getTopSellers,
    getTrustStatistics,
    autoUpdateSeller,
    getTrustHistory,
    batchUpdateTrustPoints,
    getSellerLevels
} from '../controller/trust.controller.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/top-sellers', getTopSellers);
router.get('/levels', getSellerLevels);

// Protected routes (require authentication)
router.get('/seller/:id', verifyToken, getSellerProfile);
router.get('/:id/history', verifyToken, getTrustHistory);

// Admin only routes
router.put('/:id/points', verifyAdmin, updateTrustPoints);
router.get('/statistics', verifyAdmin, getTrustStatistics);
router.patch('/seller/:id/auto-update', verifyAdmin, autoUpdateSeller);
router.post('/batch-update', verifyAdmin, batchUpdateTrustPoints);

export default router;
