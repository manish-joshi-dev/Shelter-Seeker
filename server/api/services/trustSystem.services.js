import User from '../model/user.model.js';

// Trust Points Configuration
export const TRUST_ACTIONS = {
    LISTING_CREATED: { points: 10, action: 'listing_created', reason: 'Uploaded verified property listing' },
    POSITIVE_REVIEW: { points: 5, action: 'positive_review', reason: 'Received positive buyer review' },
    SMOOTH_TRANSACTION: { points: 3, action: 'smooth_transaction', reason: 'Buyer marked transaction as smooth' },
    LISTING_REPORTED: { points: -15, action: 'listing_reported', reason: 'Listing reported as fake or inappropriate' },
    COMPLAINT_VERIFIED: { points: -10, action: 'complaint_verified', reason: 'Buyer complaint verified by admin' },
    ADMIN_BONUS: { points: 20, action: 'admin_bonus', reason: 'Admin bonus for excellent service' },
    ADMIN_PENALTY: { points: -20, action: 'admin_penalty', reason: 'Admin penalty for poor service' },
    FIRST_LISTING: { points: 5, action: 'first_listing', reason: 'First property listing bonus' },
    MONTHLY_ACTIVE: { points: 2, action: 'monthly_active', reason: 'Monthly active seller bonus' },
    REFERRAL: { points: 8, action: 'referral', reason: 'Successfully referred new seller' }
};

class TrustSystemService {
    /**
     * Update user trust points and related metrics
     * @param {string} userId - User ID
     * @param {string} actionType - Type of action from TRUST_ACTIONS
     * @param {string} adminId - Admin ID (optional, for admin actions)
     * @param {string} customReason - Custom reason (optional)
     * @returns {Promise<Object>} Updated user data
     */
    static async updateTrustPoints(userId, actionType, adminId = null, customReason = null) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            const action = TRUST_ACTIONS[actionType];
            if (!action) {
                throw new Error('Invalid action type');
            }

            const reason = customReason || action.reason;
            
            // Update trust points using the schema method
            await user.updateTrustPoints(action.points, action.action, reason, adminId);
            
            // Update seller stats if applicable
            if (actionType === 'LISTING_CREATED') {
                await user.updateSellerStats('listingsCount');
            } else if (actionType === 'POSITIVE_REVIEW') {
                await user.updateSellerStats('positiveReviews');
            } else if (actionType === 'LISTING_REPORTED') {
                await user.updateSellerStats('reportedCount');
            }

            return {
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    trustPoints: user.trustPoints,
                    rating: user.rating,
                    verifiedSeller: user.verifiedSeller,
                    sellerLevel: user.getSellerLevel(),
                    sellerStats: user.sellerStats
                }
            };
        } catch (error) {
            console.error('Error updating trust points:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get seller profile with trust information
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Seller profile data
     */
    static async getSellerProfile(userId) {
        try {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                throw new Error('User not found');
            }

            return {
                success: true,
                seller: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                    trustPoints: user.trustPoints,
                    rating: user.rating,
                    verifiedSeller: user.verifiedSeller,
                    sellerLevel: user.getSellerLevel(),
                    sellerStats: user.sellerStats,
                    trustHistory: user.trustHistory.slice(-10), // Last 10 entries
                    joinedAt: user.createdAt,
                    lastActivity: user.sellerStats.lastActivity
                }
            };
        } catch (error) {
            console.error('Error getting seller profile:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get top trusted sellers
     * @param {number} limit - Number of sellers to return
     * @returns {Promise<Object>} Top sellers data
     */
    static async getTopSellers(limit = 10) {
        try {
            const sellers = await User.find({ 
                role: 'seller',
                isBanned: false 
            })
            .select('username avatar trustPoints rating verifiedSeller sellerStats')
            .sort({ trustPoints: -1 })
            .limit(limit);

            const sellersWithLevel = sellers.map(seller => ({
                id: seller._id,
                username: seller.username,
                avatar: seller.avatar,
                trustPoints: seller.trustPoints,
                rating: seller.rating,
                verifiedSeller: seller.verifiedSeller,
                sellerLevel: seller.getSellerLevel(),
                listingsCount: seller.sellerStats.listingsCount,
                positiveReviews: seller.sellerStats.positiveReviews
            }));

            return {
                success: true,
                sellers: sellersWithLevel
            };
        } catch (error) {
            console.error('Error getting top sellers:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get trust statistics for admin dashboard
     * @returns {Promise<Object>} Trust statistics
     */
    static async getTrustStatistics() {
        try {
            const [
                totalSellers,
                verifiedSellers,
                averageTrustPoints,
                topSellers,
                recentActivity
            ] = await Promise.all([
                User.countDocuments({ role: 'seller' }),
                User.countDocuments({ role: 'seller', verifiedSeller: true }),
                User.aggregate([
                    { $match: { role: 'seller' } },
                    { $group: { _id: null, avgPoints: { $avg: '$trustPoints' } } }
                ]),
                User.find({ role: 'seller' })
                    .select('username trustPoints verifiedSeller')
                    .sort({ trustPoints: -1 })
                    .limit(5),
                User.find({ role: 'seller' })
                    .select('username trustHistory')
                    .sort({ 'trustHistory.timestamp': -1 })
                    .limit(10)
            ]);

            return {
                success: true,
                statistics: {
                    totalSellers,
                    verifiedSellers,
                    verificationRate: totalSellers > 0 ? (verifiedSellers / totalSellers * 100).toFixed(1) : 0,
                    averageTrustPoints: averageTrustPoints[0]?.avgPoints?.toFixed(1) || 0,
                    topSellers: topSellers.map(seller => ({
                        username: seller.username,
                        trustPoints: seller.trustPoints,
                        verifiedSeller: seller.verifiedSeller
                    })),
                    recentActivity: recentActivity.flatMap(user => 
                        user.trustHistory.slice(-2).map(entry => ({
                            username: user.username,
                            action: entry.action,
                            points: entry.points,
                            timestamp: entry.timestamp
                        }))
                    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)
                }
            };
        } catch (error) {
            console.error('Error getting trust statistics:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Batch update trust points for multiple users
     * @param {Array} updates - Array of {userId, actionType, adminId, customReason}
     * @returns {Promise<Object>} Batch update results
     */
    static async batchUpdateTrustPoints(updates) {
        try {
            const results = [];
            
            for (const update of updates) {
                const result = await this.updateTrustPoints(
                    update.userId,
                    update.actionType,
                    update.adminId,
                    update.customReason
                );
                results.push({
                    userId: update.userId,
                    success: result.success,
                    error: result.error
                });
            }

            return {
                success: true,
                results
            };
        } catch (error) {
            console.error('Error in batch update:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default TrustSystemService;
