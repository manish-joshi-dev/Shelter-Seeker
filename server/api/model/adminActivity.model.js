import mongoose from 'mongoose'

const adminActivitySchema = new mongoose.Schema(
    {
        adminId: {
            type: String, // admin user ID
            required: true,
        },
        adminName: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            enum: [
                'user_ban', 'user_unban', 'user_trust_points_add', 'user_trust_points_remove',
                'listing_approve', 'listing_reject', 'listing_delete',
                'report_review', 'report_resolve', 'report_dismiss',
                'user_role_change', 'system_settings_update'
            ],
            required: true,
        },
        targetType: {
            type: String,
            enum: ['user', 'listing', 'report', 'system'],
            required: true,
        },
        targetId: {
            type: String, // ID of the target (user, listing, report, etc.)
        },
        targetName: {
            type: String, // Name or title of the target for easier reference
        },
        details: {
            type: mongoose.Schema.Types.Mixed, // Flexible object for action-specific details
        },
        ipAddress: {
            type: String,
        },
        userAgent: {
            type: String,
        },
    },
    { timestamps: true }
);

// Index for efficient queries
adminActivitySchema.index({ adminId: 1 });
adminActivitySchema.index({ action: 1 });
adminActivitySchema.index({ targetType: 1 });
adminActivitySchema.index({ createdAt: -1 });

const AdminActivity = mongoose.model('AdminActivity', adminActivitySchema);
export default AdminActivity;
