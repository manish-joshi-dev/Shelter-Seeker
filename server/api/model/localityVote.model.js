import mongoose from 'mongoose'

const localityVoteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        localityInsightId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LocalityInsight',
            required: true,
        },
        category: {
            type: String,
            enum: ['waterSupply', 'powerSupply', 'traffic', 'safety', 'schools', 'dailyNeeds'],
            required: true,
        },
        voteType: {
            type: String,
            enum: ['agree', 'disagree'],
            required: true,
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LocalityQuestion',
        },
        answerId: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    { timestamps: true }
);

// Compound index to ensure one vote per user per insight category
localityVoteSchema.index({ userId: 1, localityInsightId: 1, category: 1 }, { unique: true });
localityVoteSchema.index({ userId: 1, questionId: 1, answerId: 1 }, { unique: true });

const LocalityVote = mongoose.model('LocalityVote', localityVoteSchema);
export default LocalityVote;
