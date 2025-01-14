import mongoose from 'mongoose'

const listingSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true,
        },
        address:{
            type:String,
            required:true,
        },
        regularPrice:{
            type:Number,
            required:true,
        },
        discountPrice:{
            type:Number,
            required:true,
        },
        bedRooms:{
            type:Number,
            required:true,
        },
        furnished:{
            type:Boolean,
            required:true,
        },
        parking:{
            type:Boolean,
            required:true,
        },
        type:{
            type:String,
            required:true,
        },
        offer:{
            type:Boolean,
            required:true,
        },
        imageUrls:{
            type:Array,
            required:true,
        },
        washrooms:{
            type:Number,
            required:true,
        },
        userRef:{
            type:String,
            required:true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        approvedBy: {
            type: String, // admin user ID
        },
        approvedAt: {
            type: Date,
        },
        rejectionReason: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        // Fraud detection fields
        fraudDetection: {
            fraudScore: {
                type: Number,
                default: null,
            },
            isFraudulent: {
                type: Boolean,
                default: false,
            },
            anomalyScore: {
                type: Number,
                default: null,
            },
            detectedAt: {
                type: Date,
                default: null,
            },
            fraudFeatures: {
                pricePerSqm: Number,
                areaNormalized: Number,
                bedroomsNormalized: Number,
                cityTier: Number,
            },
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: false,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                comment: String,
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                },
            },
        ],
    },
    {timestamps:true}
);

listingSchema.index({ location: '2dsphere' });

const Listing = mongoose.model('Listing',listingSchema)
export default Listing;