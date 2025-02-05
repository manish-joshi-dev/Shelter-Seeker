import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
    {
        listingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true,
        },
        reportedBy: {
            type: String, // user ID
            required: true,
        },
        reportedByName: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            enum: ['fake', 'spam', 'inappropriate', 'misleading', 'duplicate', 'other'],
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
            default: 'pending',
        },
        reviewedBy: {
            type: String, // admin user ID
        },
        reviewedAt: {
            type: Date,
        },
        adminNotes: {
            type: String,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
    },
    { timestamps: true }
);

// Index for efficient queries
reportSchema.index({ status: 1 });
reportSchema.index({ priority: 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ listingId: 1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
