import mongoose from 'mongoose'

const sellerInsightSchema = new mongoose.Schema({
    waterSupply: {
        rating: {
            type: String,
            enum: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
            default: 'Good'
        },
        description: {
            type: String,
            default: ''
        }
    },
    powerSupply: {
        rating: {
            type: String,
            enum: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
            default: 'Good'
        },
        description: {
            type: String,
            default: ''
        }
    },
    traffic: {
        rating: {
            type: String,
            enum: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
            default: 'Good'
        },
        description: {
            type: String,
            default: ''
        }
    },
    safety: {
        rating: {
            type: String,
            enum: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
            default: 'Good'
        },
        description: {
            type: String,
            default: ''
        }
    },
    schools: {
        rating: {
            type: String,
            enum: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
            default: 'Good'
        },
        description: {
            type: String,
            default: ''
        }
    },
    dailyNeeds: {
        rating: {
            type: String,
            enum: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
            default: 'Good'
        },
        description: {
            type: String,
            default: ''
        }
    }
}, { _id: false });

const localityInsightSchema = new mongoose.Schema(
    {
        listingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        localityName: {
            type: String,
            // required: true,
        },
        sellerInsights: {
            type: sellerInsightSchema,
            required: true,
            default: () => ({
                waterSupply: { rating: 'Good', description: '' },
                powerSupply: { rating: 'Good', description: '' },
                traffic: { rating: 'Good', description: '' },
                safety: { rating: 'Good', description: '' },
                schools: { rating: 'Good', description: '' },
                dailyNeeds: { rating: 'Good', description: '' }
            })
        },
        localityScore: {
            type: Number,
            min: 0,
            max: 10,
            default: 0
        },
        communityScores: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        }
    },
    { timestamps: true }
);

// Index for efficient queries
localityInsightSchema.index({ listingId: 1 });
localityInsightSchema.index({ address: 1 });
localityInsightSchema.index({ localityName: 1 });

const LocalityInsight = mongoose.model('LocalityInsight', localityInsightSchema);
export default LocalityInsight;
