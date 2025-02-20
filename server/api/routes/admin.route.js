import express from 'express';
import { verifyAdmin } from '../utils/verifyToken.js';
import {
    // User Management
    getAllUsers,
    toggleUserBan,
    updateTrustPoints,
    changeUserRole,
    
    // Listing Management
    getAllListings,
    updateListingStatus,
    deleteListing,
    
    // Report Management
    getAllReports,
    updateReportStatus,
    
    // Analytics
    getAnalytics,
    
    // Activity Logs
    getActivityLogs
} from '../controller/admin.controller.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(verifyAdmin);

// ==================== USER MANAGEMENT ROUTES ====================
router.get('/users', getAllUsers);
router.patch('/users/:userId/ban', toggleUserBan);
router.patch('/users/:userId/trust-points', updateTrustPoints);
router.patch('/users/:userId/role', changeUserRole);

// ==================== LISTING MANAGEMENT ROUTES ====================
router.get('/listings', getAllListings);
router.patch('/listings/:listingId/status', updateListingStatus);
router.delete('/listings/:listingId', deleteListing);

// ==================== REPORT MANAGEMENT ROUTES ====================
router.get('/reports', getAllReports);
router.patch('/reports/:reportId/status', updateReportStatus);

// ==================== ANALYTICS ROUTES ====================
router.get('/analytics', getAnalytics);

// ==================== ACTIVITY LOGS ROUTES ====================
router.get('/activity-logs', getActivityLogs);

export default router;
