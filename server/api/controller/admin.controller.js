import User from "../model/user.model.js";
import Listing from "../model/listing.model.js";
import Report from "../model/report.model.js";
import AdminActivity from "../model/adminActivity.model.js";
import { errorHandler } from "../utils/error.js";

// Helper function to log admin activity
const logAdminActivity = async (adminId, adminName, action, targetType, targetId, targetName, details, req) => {
    try {
        await AdminActivity.create({
            adminId,
            adminName,
            action,
            targetType,
            targetId,
            targetName,
            details,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
        });
    } catch (error) {
        console.error('Error logging admin activity:', error);
    }
};

// ==================== USER MANAGEMENT ====================

// Get all users with pagination and filtering
export const getAllUsers = async (req, res, next) => {
    try {
        console.log('Admin getAllUsers called');
        console.log('Request query:', req.query);
        console.log('Request user:', req.user);
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role;
        const isBanned = req.query.isBanned;
        const search = req.query.search;

        const query = {};
        if (role) query.role = role;
        if (isBanned !== undefined) query.isBanned = isBanned === 'true';
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        console.log('🔍 Database query:', query);

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        console.log(`📊 Found ${users.length} users out of ${total} total`);

        res.status(200).json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('❌ Error in getAllUsers:', error);
        next(error);
    }
};

// Ban/Unban user
export const toggleUserBan = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { banReason } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const wasBanned = user.isBanned;
        user.isBanned = !user.isBanned;
        user.banReason = user.isBanned ? banReason : '';

        await user.save();

        // Log activity
        await logAdminActivity(
            req.user.id,
            req.user.username,
            user.isBanned ? 'user_ban' : 'user_unban',
            'user',
            userId,
            user.username,
            { banReason, wasBanned },
            req
        );

        res.status(200).json({
            message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
            user: {
                id: user._id,
                username: user.username,
                isBanned: user.isBanned,
                banReason: user.banReason
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update user trust points
export const updateTrustPoints = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { points, action } = req.body; // action: 'add' or 'remove'

        if (!points || !action) {
            return next(errorHandler(400, 'Points and action are required'));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const oldPoints = user.trustPoints;
        let newPoints;

        if (action === 'add') {
            newPoints = Math.min(user.trustPoints + points, 100);
        } else if (action === 'remove') {
            newPoints = Math.max(user.trustPoints - points, 0);
        } else {
            return next(errorHandler(400, 'Invalid action. Use "add" or "remove"'));
        }

        user.trustPoints = newPoints;
        user.trustedSeller = newPoints >= 60;

        await user.save();

        // Log activity
        await logAdminActivity(
            req.user.id,
            req.user.username,
            action === 'add' ? 'user_trust_points_add' : 'user_trust_points_remove',
            'user',
            userId,
            user.username,
            { oldPoints, newPoints, pointsChanged: points },
            req
        );

        res.status(200).json({
            message: `Trust points ${action === 'add' ? 'added' : 'removed'} successfully`,
            user: {
                id: user._id,
                username: user.username,
                trustPoints: user.trustPoints,
                trustedSeller: user.trustedSeller
            }
        });
    } catch (error) {
        next(error);
    }
};

// Change user role
export const changeUserRole = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['admin', 'seller', 'buyer'].includes(role)) {
            return next(errorHandler(400, 'Invalid role'));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const oldRole = user.role;
        user.role = role;

        await user.save();

        // Log activity
        await logAdminActivity(
            req.user.id,
            req.user.username,
            'user_role_change',
            'user',
            userId,
            user.username,
            { oldRole, newRole: role },
            req
        );

        res.status(200).json({
            message: 'User role updated successfully',
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// ==================== LISTING MANAGEMENT ====================

// Get all listings with pagination and filtering
export const getAllListings = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;

        const query = {};
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } }
            ];
        }

        const listings = await Listing.find(query)
            .populate('userRef', 'username email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Listing.countDocuments(query);

        res.status(200).json({
            listings,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        next(error);
    }
};

// Approve/Reject listing
export const updateListingStatus = async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return next(errorHandler(400, 'Invalid status'));
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }

        const oldStatus = listing.status;
        listing.status = status;
        listing.approvedBy = req.user.id;
        listing.approvedAt = new Date();
        
        if (status === 'rejected') {
            listing.rejectionReason = rejectionReason;
        } else {
            listing.rejectionReason = '';
        }

        await listing.save();

        // Log activity
        await logAdminActivity(
            req.user.id,
            req.user.username,
            status === 'approved' ? 'listing_approve' : 'listing_reject',
            'listing',
            listingId,
            listing.name,
            { oldStatus, newStatus: status, rejectionReason },
            req
        );

        res.status(200).json({
            message: `Listing ${status} successfully`,
            listing: {
                id: listing._id,
                name: listing.name,
                status: listing.status,
                rejectionReason: listing.rejectionReason
            }
        });
    } catch (error) {
        next(error);
    }
};

// Delete listing
export const deleteListing = async (req, res, next) => {
    try {
        const { listingId } = req.params;

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return next(errorHandler(404, 'Listing not found'));
        }

        await Listing.findByIdAndDelete(listingId);

        // Log activity
        await logAdminActivity(
            req.user.id,
            req.user.username,
            'listing_delete',
            'listing',
            listingId,
            listing.name,
            { deletedBy: req.user.username },
            req
        );

        res.status(200).json({
            message: 'Listing deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// ==================== REPORT MANAGEMENT ====================

// Get all reports
export const getAllReports = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const priority = req.query.priority;

        const query = {};
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const reports = await Report.find(query)
            .populate('listingId', 'name address')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Report.countDocuments(query);

        res.status(200).json({
            reports,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        next(error);
    }
};

// Update report status
export const updateReportStatus = async (req, res, next) => {
    try {
        const { reportId } = req.params;
        const { status, adminNotes } = req.body;

        if (!['reviewed', 'resolved', 'dismissed'].includes(status)) {
            return next(errorHandler(400, 'Invalid status'));
        }

        const report = await Report.findById(reportId);
        if (!report) {
            return next(errorHandler(404, 'Report not found'));
        }

        const oldStatus = report.status;
        report.status = status;
        report.reviewedBy = req.user.id;
        report.reviewedAt = new Date();
        report.adminNotes = adminNotes || '';

        await report.save();

        // Log activity
        await logAdminActivity(
            req.user.id,
            req.user.username,
            `report_${status}`,
            'report',
            reportId,
            `Report for ${report.listingId}`,
            { oldStatus, newStatus: status, adminNotes },
            req
        );

        res.status(200).json({
            message: `Report ${status} successfully`,
            report: {
                id: report._id,
                status: report.status,
                adminNotes: report.adminNotes
            }
        });
    } catch (error) {
        next(error);
    }
};

// ==================== ANALYTICS ====================

// Get dashboard analytics
export const getAnalytics = async (req, res, next) => {
    try {
        console.log('📊 Admin getAnalytics called');
        console.log('👤 Request user:', req.user);
        
        const [
            totalUsers,
            totalListings,
            pendingListings,
            approvedListings,
            rejectedListings,
            bannedUsers,
            totalReports,
            pendingReports,
            trustedSellers,
            recentUsers,
            recentListings,
            recentReports
        ] = await Promise.all([
            User.countDocuments(),
            Listing.countDocuments(),
            Listing.countDocuments({ status: 'pending' }),
            Listing.countDocuments({ status: 'approved' }),
            Listing.countDocuments({ status: 'rejected' }),
            User.countDocuments({ isBanned: true }),
            Report.countDocuments(),
            Report.countDocuments({ status: 'pending' }),
            User.countDocuments({ trustedSeller: true }),
            User.find().sort({ createdAt: -1 }).limit(5).select('username email createdAt role'),
            Listing.find().sort({ createdAt: -1 }).limit(5).populate('userRef', 'username'),
            Report.find().sort({ createdAt: -1 }).limit(5).populate('listingId', 'name')
        ]);

        const analyticsData = {
            overview: {
                totalUsers,
                totalListings,
                pendingListings,
                approvedListings,
                rejectedListings,
                bannedUsers,
                totalReports,
                pendingReports,
                trustedSellers
            },
            recent: {
                users: recentUsers,
                listings: recentListings,
                reports: recentReports
            }
        };

        console.log('📊 Analytics data:', analyticsData);

        res.status(200).json(analyticsData);
    } catch (error) {
        console.error('❌ Error in getAnalytics:', error);
        next(error);
    }
};

// ==================== ACTIVITY LOGS ====================

// Get admin activity logs
export const getActivityLogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const action = req.query.action;
        const adminId = req.query.adminId;

        const query = {};
        if (action) query.action = action;
        if (adminId) query.adminId = adminId;

        const activities = await AdminActivity.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await AdminActivity.countDocuments(query);

        res.status(200).json({
            activities,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        next(error);
    }
};
