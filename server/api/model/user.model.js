import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        avatar:{
            type:String,
            // default:"data:image/jpeg;base64,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",
        },
        role: {
            type: String,
            enum: ['admin', 'seller', 'buyer'],
            default: 'buyer',
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        trustPoints: {
            type: Number,
            default: 0,
            min: 0,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        verifiedSeller: {
            type: Boolean,
            default: false,
        },
        sellerStats: {
            listingsCount: {
                type: Number,
                default: 0,
            },
            positiveReviews: {
                type: Number,
                default: 0,
            },
            reportedCount: {
                type: Number,
                default: 0,
            },
            totalTransactions: {
                type: Number,
                default: 0,
            },
            lastActivity: {
                type: Date,
                default: Date.now,
            }
        },
        trustHistory: [{
            action: {
                type: String,
                required: true,
            },
            points: {
                type: Number,
                required: true,
            },
            reason: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
            adminId: {
                type: String,
                default: null,
            }
        }],
        banReason: {
            type: String,
            default: '',
        },
        lastLogin: {
            type: Date,
            default: Date.now,
        },
    },{timestamps:true}
);

// Helper methods for trust system
userSchema.methods.updateTrustPoints = function(points, action, reason, adminId = null) {
    this.trustPoints = Math.max(0, this.trustPoints + points);
    this.rating = Math.min(5, Math.max(0, parseFloat((this.trustPoints / 20).toFixed(1))));
    this.verifiedSeller = this.trustPoints >= 60;
    
    // Add to trust history
    this.trustHistory.push({
        action,
        points,
        reason,
        adminId,
        timestamp: new Date()
    });
    
    // Keep only last 50 entries
    if (this.trustHistory.length > 50) {
        this.trustHistory = this.trustHistory.slice(-50);
    }
    
    return this.save();
};

userSchema.methods.getSellerLevel = function() {
    if (this.trustPoints >= 100) return { level: 'Platinum', emoji: '💎', color: 'purple' };
    if (this.trustPoints >= 61) return { level: 'Gold', emoji: '🥇', color: 'yellow' };
    if (this.trustPoints >= 31) return { level: 'Silver', emoji: '🥈', color: 'gray' };
    return { level: 'Bronze', emoji: '🥉', color: 'orange' };
};

userSchema.methods.updateSellerStats = function(statType, increment = 1) {
    if (this.sellerStats[statType] !== undefined) {
        this.sellerStats[statType] += increment;
        this.sellerStats.lastActivity = new Date();
    }
    return this.save();
};

// Index for efficient queries
userSchema.index({ role: 1 });
userSchema.index({ isBanned: 1 });
userSchema.index({ trustPoints: -1 });
userSchema.index({ verifiedSeller: 1 });
userSchema.index({ 'sellerStats.listingsCount': -1 });

const User = mongoose.model('User',userSchema);
export default User;